import { useState } from "react";

import apiClient, { tokenStorage } from "../../lib/apiClient";

// Traduce los mensajes del backend (en ingles) a algo mostrable al usuario.
const friendlyMessage = (message = "") => {
  const map = {
    "Fields required": "Completa todos los campos.",
    "Email already registered": "Ese correo ya tiene una cuenta.",
    "DUI already registered": "Ese DUI ya esta registrado.",
    "Phone already registered": "Ese telefono ya esta registrado.",
    "Invalid code": "El codigo no es correcto. Verificalo e intentalo de nuevo.",
    "Expired registration": "El registro expiro. Vuelve a crear tu cuenta.",
    "Customer already exists": "Esta cuenta ya fue verificada. Inicia sesion.",
  };
  return map[message] || message || "Ocurrio un error inesperado.";
};

// Versión para React Native del hook de la web. Tres cambios de fondo:
//   1. La URL sale de config/api.js: dentro del teléfono "localhost" es el teléfono mismo.
//   2. No hay cookies. En la web, registerCustomer deja una cookie con el token de
//      verificación y verifyCode la reenvía sola con credentials: "include". Aquí hay que
//      guardar ese token a mano y mandarlo en el header, o el servidor recibe el código
//      sin saber a qué registro pertenece.
//   3. apiClient traduce los errores de red a mensajes legibles y corta a los 15 segundos.
const useRegisterCustomer = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const registerCustomer = async (data) => {
    if (submitting) return false; // un doble tap crearía dos registros

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const result = await apiClient("/registerCustomer", {
        method: "POST",
        body: data,
      });

      // El backend devuelve este token en el body (además de la cookie que usa la web).
      // Sin él, verifyCode no tiene forma de identificar el registro pendiente.
      const token = result?.verificationToken || result?.token;
      if (token) await tokenStorage.set(token);

      setMessage(result?.message || "Código de verificación enviado");
      return true;
    } catch (err) {
      setError(friendlyMessage(err.message));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async (verificationCodeRequest) => {
    if (submitting) return null;

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      // apiClient adjunta solo el token que guardó registerCustomer
      const result = await apiClient("/registerCustomer/verifyCodeEmail", {
        method: "POST",
        body: { verificationCodeRequest },
      });

      // La verificación devuelve el token de sesión definitivo: reemplaza al
      // temporal para que el usuario quede logueado sin pasar por el login.
      if (result?.token) await tokenStorage.set(result.token);

      setMessage(result?.message || "Cuenta verificada con éxito");
      // Se devuelve el resultado (token + user) para que la pantalla active
      // la sesión en AuthContext.
      return result ?? {};
    } catch (err) {
      setError(friendlyMessage(err.message));
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return { registerCustomer, verifyCode, submitting, error, message };
};

export default useRegisterCustomer;
