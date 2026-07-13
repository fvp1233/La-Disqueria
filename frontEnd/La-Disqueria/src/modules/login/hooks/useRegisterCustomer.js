import { useState } from "react";

const API_URL = "http://localhost:4000/api/registerCustomer";

const useRegisterCustomer = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const registerCustomer = async (data) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      setMessage(result.message || "Código de verificación enviado");
      return true;
    } catch (err) {
      setError(err.message || "Error al registrar el usuario");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async (verificationCodeRequest) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/verifyCodeEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ verificationCodeRequest }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      setMessage(result.message || "Cuenta verificada con éxito");
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
