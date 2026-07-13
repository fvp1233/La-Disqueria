import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function ProtectedRoute() {
  const { user, checkingSession } = useAuth()

  // Mientras se confirma la cookie con el backend no se decide nada: ni se
  // muestra la ruta protegida ni se manda a /login por error.
  if (checkingSession) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-gray-500">
        Verificando sesión...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
