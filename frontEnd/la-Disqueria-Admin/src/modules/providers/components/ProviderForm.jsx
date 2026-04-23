"use client"

import { useState, useEffect } from "react"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Button } from "@/global/components/button"

export function ProviderForm({ onClose, provider, mode = "edit" }) {

    const [internalMode, setInternalMode] = useState(mode)

    useEffect(() => {
        setInternalMode(mode)
    }, [mode])

    const isReadOnly = internalMode === "view"

    const [compania, setCompania] = useState("")
    const [contacto, setContacto] = useState("")
    const [correo, setCorreo] = useState("")
    const [telefono, setTelefono] = useState("")
    const [pais, setPais] = useState("")
    const [ciudad, setCiudad] = useState("")

    useEffect(() => {
        if (!provider) return

        setCompania(provider.compania || "")
        setContacto(provider.contacto || "")
        setCorreo(provider.correo || "")
        setTelefono(provider.telefono || "")
        setPais(provider.pais || "")
        setCiudad(provider.ciudad || "")
    }, [provider])

    return (
        <form className="flex flex-col gap-4">

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">
                {/* LOGO */}
                <div>
                    <Label>Logo</Label>
                    <div className={`border rounded-md p-4 h-8 flex items-center justify-center ${isReadOnly ? "text-gray-400" : "text-red-400 cursor-pointer"
                        }`}>
                        + Subir imagen
                    </div>
                </div>

                <div>
                    <Label>Compañía</Label>
                    <Input value={compania} onChange={(e) => setCompania(e.target.value)} disabled={isReadOnly} />
                </div>

                <div>
                    <Label>Nombre de contacto</Label>
                    <Input value={contacto} onChange={(e) => setContacto(e.target.value)} disabled={isReadOnly} />
                </div>

                <div>
                    <Label>Correo electrónico</Label>
                    <Input value={correo} onChange={(e) => setCorreo(e.target.value)} disabled={isReadOnly} />
                </div>

                <div>
                    <Label>Número de teléfono</Label>
                    <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} disabled={isReadOnly} />
                </div>

                <div>
                    <Label>Ciudad</Label>
                    <Input value={ciudad} onChange={(e) => setCiudad(e.target.value)} disabled={isReadOnly} />
                </div>
                <div>
                    <Label>País</Label>
                    <Input value={pais} onChange={(e) => setPais(e.target.value)} disabled={isReadOnly} />
                </div>



            </div>

            {/* CATÁLOGO */}
            <div>
                <Label>Catálogo</Label>
                <div className={`border rounded-xl p-4 h-32 flex items-center justify-center ${isReadOnly ? "text-gray-400" : "text-red-400 cursor-pointer"
                    }`}>
                    + Agregar producto
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