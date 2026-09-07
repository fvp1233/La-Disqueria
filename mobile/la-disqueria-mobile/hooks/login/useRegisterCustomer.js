import { useState } from "react";

import apiClient, { tokenStorage } from "../lib/apiClient";

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

      // El backend debe devolver este token en el body (además de la cookie que usa la web).
      // Sin él, verifyCode no tiene forma de identificar el registro pendiente.
      const token = result?.verificationToken || result?.token;
      if (token) await tokenStorage.set(token);

      setMessage(result?.message || "Código de verificación enviado");
      return true;
    } catch (err) {
      setError(err.message || "Error al registrar el usuario");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async (verificationCodeRequest) => {
    if (submitting) return false;

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      // apiClient adjunta solo el token que guardó registerCustomer
      const result = await apiClient("/registerCustomer/verifyCodeEmail", {
        method: "POST",
        body: { verificationCodeRequest },
      });

      // Si la verificación devuelve el token de sesión definitivo, reemplaza al temporal
      // y el usuario queda logueado sin pasar por la pantalla de login
      if (result?.token) await tokenStorage.set(result.token);

      setMessage(result?.message || "Cuenta verificada con éxito");
      return true;
    } catch (err) {
      setError(err.message || "Error al verificar el código");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { registerCustomer, verifyCode, submitting, error, message };
};

export default useRegisterCustomer;