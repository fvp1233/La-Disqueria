import { useState } from "react"
import { Input } from "@/global/components/Input"
import { Button } from "@/global/components/Button"
import { Avatar, AvatarImage, AvatarFallback } from "@/global/components/Avatar"

export default function PerfilUsuario() {
  const [isEditing, setIsEditing] = useState(false)

  const [user, setUser] = useState({
    nombre: "Luis",
    apellido: "Ramírez",
    correo: "luis@email.com",
    password: "",
    posicion: "Administrador",
    fechaContratacion: "2024-01-15",
    foto: "https://github.com/shadcn.png"
  })

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    console.log("guardando...", user)
    setIsEditing(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.foto} />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-xl font-semibold">
            {user.nombre} {user.apellido}
          </h2>
          <p className="text-muted-foreground">{user.correo}</p>
        </div>
      </div>

      {/* Datos */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label>Nombre</label>
          <Input
            name="nombre"
            value={user.nombre}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Apellido</label>
          <Input
            name="apellido"
            value={user.apellido}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Correo</label>
          <Input
            name="correo"
            value={user.correo}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Contraseña</label>
          <Input
            type="password"
            name="password"
            placeholder="********"
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Posición</label>
          <Input
            name="posicion"
            value={user.posicion}
            disabled
          />
        </div>

        <div>
          <label>Fecha de contratación</label>
          <Input
            name="fechaContratacion"
            value={user.fechaContratacion}
            disabled
          />
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
            <Button variant="cancel" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="cd">
              Guardar cambios
            </Button>
          </>
        )}
      </div>

    </div>
  )
}