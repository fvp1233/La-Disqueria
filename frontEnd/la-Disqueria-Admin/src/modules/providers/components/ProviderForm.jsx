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

    const [selectedProducts, setSelectedProducts] = useState([])
    const [openProductsModal, setOpenProductsModal] = useState(false)
    const [search, setSearch] = useState("")

    const [logo, setLogo] = useState(null)
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        if (!provider) return

        setCompania(provider.compania || "")
        setContacto(provider.contacto || "")
        setCorreo(provider.correo || "")
        setTelefono(provider.telefono || "")
        setPais(provider.pais || "")
        setCiudad(provider.ciudad || "")
    }, [provider])

    //MOCK PRODUCTOS
    const mockProducts = [
        {
            id: 1,
            nombre: "Bright Future",
            artista: "Adrianne Lenker",
            formato: "Vinilo",
            color: "Negro",
            precio: 29.99,
            imagen: "https://media.pitchfork.com/photos/65a6ccaa37e7c24b108f0e09/master/pass/Adrianne-Lenker-Bright-Future.jpg",
        },
        {
            id: 2,
            nombre: "Happier Than Ever",
            artista: "Billie Eilish",
            formato: "Vinilo",
            color: "Blanco",
            precio: 34.99,
            imagen: "https://media.pitchfork.com/photos/608839f84c67840074db8afb/1:1/w_450%2Cc_limit/Billie-Eilish-Happier-Than-Ever.jpeg",
        },
        {
            id: 3,
            nombre: "SOUR",
            artista: "Olivia Rodrigo",
            formato: "CD",
            color: "Transparente",
            precio: 14.99,
            imagen: "https://media.pitchfork.com/photos/6076fd2e17d37fe4717d4907/1:1/w_450%2Cc_limit/Olivia-Rodrigo-SOUR.jpeg",
        },
    ]

    const filteredProducts = mockProducts.filter((p) =>
        (p.nombre + " " + p.artista)
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    return (
        <>
            <form className="flex flex-col gap-4">

                {/* GRID */}
                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <Label>Logo</Label>

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

                    <div className="border rounded-xl p-3 h-40 flex flex-col gap-2 overflow-y-auto">

                        {/* LISTA */}
                        {selectedProducts.map((p, index) => (
                            <div key={index} className="flex items-center gap-3 border rounded-lg p-2">

                                <img src={p.imagen} className="w-10 h-10 rounded-md" />

                                <div className="flex-1">
                                    <p className="text-sm font-medium">{p.nombre}</p>
                                    <p className="text-xs text-gray-500">{p.artista}</p>
                                </div>

                                <div className="text-xs text-gray-400">
                                    {p.formato} • {p.color}
                                </div>

                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedProducts(prev =>
                                                prev.filter((_, i) => i !== index)
                                            )
                                        }}
                                        className="text-red-400 text-xs hover:underline"
                                    >
                                        Quitar
                                    </button>
                                )}

                            </div>
                        ))}

                        {/* BOTÓN */}
                        {!isReadOnly && (
                            <button
                                type="button"
                                onClick={() => setOpenProductsModal(true)}
                                className="text-sm text-red-400 mt-2 hover:bg-red-50 border p-1.5 rounded"
                            >
                                + Agregar producto
                            </button>
                        )}
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

            {/* MODAL PRODUCTOS */}
            {openProductsModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-[800px] max-h-[85vh] flex flex-col p-5">

                        {/* HEADER */}
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Seleccionar productos</h2>

                            <input
                                type="text"
                                placeholder="Buscar por nombre o artista..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="mt-3 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
                            />
                        </div>

                        {/* LISTA */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">

                            {filteredProducts.map((prod) => {
                                const isSelected = selectedProducts.find(p => p.id === prod.id)

                                return (
                                    <div
                                        key={prod.id}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedProducts(prev =>
                                                    prev.filter(p => p.id !== prod.id)
                                                )
                                            } else {
                                                setSelectedProducts(prev => [...prev, prod])
                                            }
                                        }}
                                        className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer ${isSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50"
                                            }`}
                                    >

                                        <img src={prod.imagen} className="w-14 h-14 rounded-md object-cover" />

                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{prod.nombre}</p>
                                            <p className="text-xs text-gray-500">{prod.artista}</p>
                                        </div>

                                        <div className="text-xs text-gray-400 text-right">
                                            <p>{prod.formato}</p>
                                            <p>{prod.color}</p>
                                        </div>

                                        <div className="text-sm font-semibold w-20 text-right">
                                            ${prod.precio}
                                        </div>

                                    </div>
                                )
                            })}

                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-between items-center mt-4">

                            <span className="text-sm text-gray-500">
                                {selectedProducts.length} producto(s)
                            </span>

                            <div className="flex gap-3">
                                <Button variant="cancel" onClick={() => setOpenProductsModal(false)}>
                                    Cancelar
                                </Button>

                                <Button onClick={() => setOpenProductsModal(false)} variant="cd">
                                    Agregar
                                </Button>
                            </div>

                        </div>

                    </div>
                </div>
            )}
        </>
    )
}