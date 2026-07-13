import { useEffect, useState } from "react"
import { Input } from "@/global/components/Input"
import { Button } from "@/global/components/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/global/components/Avatar"
import { StatusBadge } from "@/global/components/StatusBadge"
import { useAuth } from "@/context/AuthContext"
import useProfile from "@/modules/profile/hooks/useProfile"

// Imagen por defecto: aún no hay subida de foto de perfil para el admin
const DEFAULT_AVATAR = "https://img.freepik.com/free-photo/view-adorable-3d-cat_23-2150473714.jpg?semt=ais_rp_progressive&w=740&q=80"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { updateProfile, submitting } = useProfile()

  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      password: "",
    })
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      password: "",
    })
    setIsEditing(false)
  }

  const handleSave = async () => {
    const payload = {
      name: form.name,
      last_name: form.last_name,
      email: form.email,
    }
    if (form.password.trim()) payload.password = form.password

    const updated = await updateProfile(user.id, payload)
    if (updated) {
      updateUser({ name: updated.name, last_name: updated.last_name, email: updated.email })
      setForm((prev) => ({ ...prev, password: "" }))
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-muted-foreground">No hay una sesión iniciada.</p>
      </div>
    )
  }

  const initials = `${user.name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || "AD"

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={DEFAULT_AVATAR} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold">
            {user.name} {user.last_name}
          </h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Datos */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label>Nombre</label>
          <Input
            name="name"
            value={form.name}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Apellido</label>
          <Input
            name="last_name"
            value={form.last_name}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Correo</label>
          <Input
            name="email"
            value={form.email}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Contraseña</label>
          <Input
            type="password"
            name="password"
            value={form.password}
            placeholder={isEditing ? "Dejar en blanco para no cambiar" : "********"}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-2">Estado</label>
          <StatusBadge estado={user.is_active ? "Activo" : "Inactivo"} />
        </div>

      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <Button variant="cd" onClick={() => setIsEditing(true)}>
            Editar perfil
          </Button>
        ) : (
          <>
            <Button variant="cancel" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </>
        )}
      </div>

    </div>
  )
}
