"use client"

import { useState, useEffect } from "react"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Button } from "@/global/components/button"
import { FormDropdown } from "@/global/components/FormDropdown"

export function EmployeeForm({ onClose, employee, mode = "edit" }) {

    const [internalMode, setInternalMode] = useState(mode)

    useEffect(() => {
        setInternalMode(mode)
    }, [mode])

    const isReadOnly = internalMode === "view"

    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [correo, setCorreo] = useState("")
    const [posicion, setPosicion] = useState("")
    const [fecha, setFecha] = useState("")
    const [estado, setEstado] = useState("Activo")

    useEffect(() => {
        if (!employee) return

        setNombre(employee.nombre || "")
        setApellido(employee.apellido || "")
        setCorreo(employee.correo || "")
        setPosicion(employee.posicion || "")
        setFecha(employee.fecha || "")
        setEstado(employee.activo || "Activo")
    }, [employee])

    const statusOptions = [
        { label: "Activo", value: "Activo" },
        { label: "Inactivo", value: "Inactivo" },
    ]

    return (
        <form className="flex flex-col gap-4">

            <div>
                <Label>Imagen</Label>
                <div className={`border rounded-md p-4 h-8 flex items-center justify-center ${isReadOnly ? "text-gray-400" : "text-red-400 cursor-pointer"
                    }`}>
                    + Subir imagen
                </div>
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
                    <Label>Posición</Label>
                    <Input value={posicion} onChange={(e) => setPosicion(e.target.value)} disabled={isReadOnly} />
                </div>

                <div>
                    <Label>Fecha de contratación</Label>
                    <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={isReadOnly} />
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