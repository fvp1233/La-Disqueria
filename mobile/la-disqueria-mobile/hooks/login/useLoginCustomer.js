import { useState } from "react";

import apiClient from "../../lib/apiClient";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Traduce los mensajes del backend (en ingles) a algo mostrable al usuario.
const friendlyMessage = (message = "") => {
  const map = {
    "Email and password are required.": "Ingresa tu correo y contraseña.",
    "Customer not found": "No encontramos una cuenta con ese correo.",
    "Wrong password": "Contraseña incorrecta.",
    "Blocked account": "Tu cuenta está bloqueada temporalmente. Intenta más tarde.",
    "Blocked account for many attemps":
      "Demasiados intentos fallidos. Tu cuenta se bloqueó por 5 minutos.",
  };
  return map[message] || message || "No se pudo iniciar sesión.";
};

/**
 * Inicio de sesión del cliente (POST /api/customers/login).
 * El backend devuelve un token JWT (30 días) y los datos del usuario.
 * La persistencia y el estado global de la sesión los maneja AuthContext
 * (signIn); este hook solo valida y hace la petición.
 */
const useLoginCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setError(null);

    const cleanEmail = email?.trim().toLowerCase() ?? "";
    const cleanPassword = password?.trim() ?? "";

    if (!cleanEmail || !cleanPassword) {
      setError("Ingresa tu correo y contraseña.");
      return null;
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Ingresa un correo electrónico válido.");
      return null;
    }

    try {
      setLoading(true);
      const data = await apiClient("/customers/login", {
        method: "POST",
        body: { email: cleanEmail, password: cleanPassword },
      });

      return { user: data?.user ?? null, token: data?.token ?? null };
    } catch (requestError) {
      setError(friendlyMessage(requestError.message));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, setError };
};

export default useLoginCustomer;
