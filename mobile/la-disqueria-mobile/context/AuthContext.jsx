import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import apiClient, {
  setOnUnauthorized,
  tokenStorage,
  userStorage,
} from '../lib/apiClient';

const AuthContext = createContext(null);

// Tiempo mínimo que se muestra el splash al abrir la app, por identidad de marca.
const MIN_SPLASH_MS = 1600;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const mounted = useRef(true);

  // Persiste token + usuario y deja la sesión activa.
  const signIn = useCallback(async (nextUser, token) => {
    if (token) await tokenStorage.set(token);
    if (nextUser) await userStorage.set(nextUser);
    setUser(nextUser ?? null);
  }, []);

  // Limpia la sesión local. Intenta avisar al backend, pero no bloquea si falla.
  const signOut = useCallback(async () => {
    try {
      await apiClient('/logout', { method: 'POST', timeout: 5000 });
    } catch {
      // El logout del servidor solo borra una cookie; si no responde, no importa.
    }
    await tokenStorage.remove();
    await userStorage.remove();
    setUser(null);
  }, []);

  // Restaura la sesión guardada al arrancar.
  useEffect(() => {
    mounted.current = true;
    const startedAt = Date.now();

    (async () => {
      let restored = null;
      try {
        const [token, savedUser] = await Promise.all([
          tokenStorage.get(),
          userStorage.get(),
        ]);
        if (token && savedUser) restored = savedUser;
      } catch {
        restored = null;
      }

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_SPLASH_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS - elapsed));
      }

      if (!mounted.current) return;
      setUser(restored);
      setBootstrapping(false);
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  // Si apiClient recibe un 401 (token vencido), cierra la sesión en toda la app.
  useEffect(() => {
    setOnUnauthorized(() => {
      userStorage.remove();
      setUser(null);
    });
    return () => setOnUnauthorized(null);
  }, []);

  const value = useMemo(
    () => ({ user, bootstrapping, isAuthenticated: !!user, signIn, signOut }),
    [user, bootstrapping, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}
