import { createContext, useContext, useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("adminUser");
    return stored ? JSON.parse(stored) : null;
  });
  // checkingSession empieza en true: mientras no confirmemos la cookie con el
  // backend, las rutas protegidas no deben decidir si dejan pasar o no.
  const [checkingSession, setCheckingSession] = useState(true);

  // Al cargar la app (o refrescar), confirma contra el backend que la cookie
  // sigue siendo válida. Si no lo es, limpia cualquier rastro en localStorage
  // para que nadie quede "logeado" solo porque el dato quedó guardado ahí.
  useEffect(() => {
    let cancelled = false;

    const verifySession = async () => {
      try {
        const response = await fetch(`${API_URL}/login/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Invalid session");
        }

        const data = await response.json();
        if (cancelled) return;

        setUser(data.user);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
      } catch {
        if (cancelled) return;
        setUser(null);
        localStorage.removeItem("adminUser");
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, []);

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
    <AuthContext.Provider
      value={{ user, checkingSession, login, logout, updateUser }}
    >
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
