import { createContext, useContext, useState } from "react";

const API_URL = "http://localhost:4000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("adminUser");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo iniciar sesión");
    }

    setUser(data.user);
    localStorage.setItem("adminUser", JSON.stringify(data.user));

    return data.user;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      localStorage.removeItem("adminUser");
    }
  };

  // Actualiza el usuario en memoria y localStorage tras editar el perfil,
  // sin necesidad de volver a iniciar sesión.
  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("adminUser", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
