import jsonwebToken from "jsonwebtoken";
import { config } from "../../config.js";

export const validateAuthCookie = (allowedTypes = []) => {
  return (req, res, next) => {
    try {
      //#1 Extraer el token de la cookie o del encabezado Authorization (clientes móviles)
      const bearer = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null;
      const token = req.cookies.authCookie || bearer;

      if (!token) {
        return res
          .status(403)
          .json({ message: "No cookie found, Authorization required" });
      }

      //#2 Extraer toda la informacion del token
      const decoded = jsonwebToken.verify(token, config.JWT.secret);

      //#3 Verificar si el rol de la cookie puede pasar o no
      if (allowedTypes.length > 0 && !allowedTypes.includes(decoded.userType)) {
        return res.status(401).json({ message: "Acces denied" });
      }

      req.user = decoded;

      next();
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }
      console.log("error" + error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
