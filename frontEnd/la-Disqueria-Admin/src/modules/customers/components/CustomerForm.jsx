"use client"

import { useState, useEffect } from "react"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Button } from "@/global/components/button"
import { FormDropdown } from "@/global/components/FormDropdown"

export function CustomerForm({ onClose, customer, mode = "edit" }) {

  const [internalMode, setInternalMode] = useState(mode)

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  const isReadOnly = internalMode === "view"

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [correo, setCorreo] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [estado, setEstado] = useState("Activo")

  const [logo, setLogo] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!customer) return

    setNombre(customer.nombre || "")
    setApellido(customer.apellido || "")
    setCorreo(customer.correo || "")
    setTelefono(customer.telefono || "")
    setDireccion(customer.direccion || "")
    setEstado(customer.activo || "Activo")
  }, [customer])

  const statusOptions = [
    { label: "Activo", value: "Activo" },
    { label: "Inactivo", value: "Inactivo" },
  ]

  return (
    <form className="flex flex-col gap-4">

      <div>
        <Label>Imagen</Label>

        <div
          onClick={() => {
            if (!isReadOnly) {
              document.getElementById("logoInput").click()
            }
          }}
          className={`border rounded-md p-4 h-8 flex items-center justify-center ${isReadOnly ? "text-gray-400" : "text-red-400 cursor-pointer hover:bg-red-50"
            }`}
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full object-contain"
            />
          ) : (
            "+ Subir imagen"
          )}
        </div>

        {/* INPUT OCULTO */}
        <input
          id="logoInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0]
            if (!file) return

            setLogo(file)

            // preview
            const url = URL.createObjectURL(file)
            setPreview(url)
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">



        <div>
          <Label>Nombre</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={isReadOnly} />
        </div>

        <div>
          <Label>Apellido</Label>
          <Input value={apellido} onChange={(e) => setApellido(e.target.value)} disabled={isReadOnly} />
        </div>

        <div>
          <Label>Correo</Label>
          <Input value={correo} onChange={(e) => setCorreo(e.target.value)} disabled={isReadOnly} />
        </div>

        <div>
          <Label>Teléfono</Label>
          <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} disabled={isReadOnly} />
        </div>

        <div>
          <Label>Dirección</Label>
          <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} disabled={isReadOnly} />
        </div>

        <div>
          <Label>Estado</Label>
          <FormDropdown
            options={statusOptions}
            value={estado}
            onChange={setEstado}
            disabled={isReadOnly}
          />
        </div>

      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 mt-4 mb-2">

        <Button variant="cancel" onClick={onClose}>
          {isReadOnly ? "Cerrar" : "Cancelar"}
        </Button>

        {isReadOnly && (
          <Button onClick={() => setInternalMode("edit")} variant="cd">
            Editar
          </Button>
        )}

        {!isReadOnly && (
          <Button type="submit" variant="cd">
            Guardar
          </Button>
        )}

      </div>

    </form>
  )
}