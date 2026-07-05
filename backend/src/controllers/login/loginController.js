import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../../../config.js";
import adminModel from "../../models/admin/admin.js";

// loginController se ejecuta una vez cuando el admin escribe sus credenciales
// en el formulario de login y da click en iniciar sesión, valida la identidad
// y aplica el inicio de sesión. Solo existe el rol de admin en este proyecto.

const loginController = {};

loginController.loginAdmin = async (req, res) => {
  try {
    // 1. Extraemos las credenciales enviadas
    let { email, password } = req.body;

    // Verifica que todos los campos sean enviados
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // 2. Sanitización de campos
    email = email?.trim();
    password = password?.trim();

    // 3. Buscamos al admin por su correo
    const adminFound = await adminModel.findOne({ email });

    // Si no se encontró el correo, rechazamos la petición
    if (!adminFound) {
      return res.status(400).json({ message: "User not found" });
    }

    // 4. Si el usuario tiene los 15 minutos de bloqueo rechaza el inicio de sesion
    if (adminFound.time_out && adminFound.time_out > Date.now()) {
      return res.status(400).json({ message: "User is locked" });
    }

    // 5. Compara las contraseñas, la que enviamos con la encriptada
    const isMatch = await bcrypt.compare(password, adminFound.password);

    // Si no coinciden
    if (!isMatch) {
      // Aumentamos el contador de intentos fallidos
      adminFound.loginAttempts = (adminFound.loginAttempts || 0) + 1;

      // Si el contador llega a 5 se bloquea por 15 minutos
      if (adminFound.loginAttempts >= 5) {
        adminFound.time_out = Date.now() + 1000 * 60 * 15; // 15 minutos
        adminFound.loginAttempts = 0;
        await adminFound.save();
        return res.status(400).json({ message: "User is locked" });
      }

      // Si fallo pero el contador aun no es 5, solo se guarda el contador de intentos
      await adminFound.save();
      return res.status(400).json({ message: "Wrong password" });
    }

    // 6. Login correcto: reseteamos intentos fallidos y bloqueo
    adminFound.loginAttempts = 0;
    adminFound.time_out = null;
    await adminFound.save();

    // 7. Generamos el token, guardando el id y su rol
    const token = jsonwebtoken.sign(
      { id: adminFound._id, userType: "admin" },
      config.JWT.secret,
      { expiresIn: "30d" }
    );

    // 8. Se guarda el token en una cookie
    res.cookie("authCookie", token);

    // Retornamos un estado exitoso junto con información que usará el frontend del usuario logeado
    return res.status(200).json({
      message: "Login successful",
      token,
      userType: "admin",
      user: {
        id: adminFound._id,
        email: adminFound.email,
        name: adminFound.name,
        last_name: adminFound.last_name,
        is_active: adminFound.is_active,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginController;
