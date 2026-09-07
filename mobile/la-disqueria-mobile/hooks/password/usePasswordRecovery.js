import { useState } from "react";
import apiClient from "../../lib/apiClient";

const friendlyMessage = (message = "") => {
  const map = {
    "Email is required": "Ingresa tu correo electrónico.",
    "Customer not found": "No encontramos una cuenta con ese correo.",
    "Invalid code": "El código no es correcto. Verificalo e intentalo de nuevo.",
    "Expired recovery code": "El código expiró. Solicita uno nuevo.",
    "Password is required": "Ingresa una contraseña.",
  };
  return map[message] || message || "Ocurrió un error inesperado.";
};

const usePasswordRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("email"); // email -> code -> newPassword -> done

  const requestRecovery = async (email) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient("/customers/password-recovery", {
        method: "POST",
        body: { email: email.trim().toLowerCase() },
      });

      setStep("code");
      return true;
    } catch (err) {
      setError(friendlyMessage(err.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient("/customers/password-recovery/verify", {
        method: "POST",
        body: { code: code.trim() },
      });

      if (response?.valid) {
        setStep("newPassword");
        return true;
      }
      setError("El código no es válido.");
      return false;
    } catch (err) {
      setError(friendlyMessage(err.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (code, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      await apiClient("/customers/password-recovery/reset", {
        method: "POST",
        body: { code: code.trim(), password: newPassword.trim() },
      });

      setStep("done");
      return true;
    } catch (err) {
      setError(friendlyMessage(err.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("email");
    setError(null);
  };

  return {
    requestRecovery,
    verifyCode,
    resetPassword,
    loading,
    error,
    step,
    reset,
    setError,
  };
};

export default usePasswordRecovery;
