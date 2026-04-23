import { cn } from "@/lib/utils"

export function StatusBadge({ estado }) {
  const styles = {
    Entregado: "bg-green-100 text-green-700",
    "En camino": "bg-yellow-100 text-yellow-700",
    Pendiente: "bg-gray-100 text-gray-600",
    Cancelado: "bg-red-100 text-red-700",
  }

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full",
        styles[estado] || "bg-gray-100 text-gray-600"
      )}
    >
      {estado}
    </span>
  )
}