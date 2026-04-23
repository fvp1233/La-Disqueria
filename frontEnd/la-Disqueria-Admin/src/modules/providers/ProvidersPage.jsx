import { useState } from "react"
import { Plus } from "lucide-react"

import Card from "@/global/components/Card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table"
import { InputGroupInlineStart } from "@/global/components/SearchInput"
import { Button } from "@/global/components/button"
import { Modal } from "@/global/components/Modal"
import { ProviderForm } from "@/modules/providers/components/ProviderForm"
import { FilterDropdown } from "@/global/components/FilterDropdown"

const proveedores = [
  {
    id: "#01542d415s",
    logo: "/logos/sonidos.png",
    compania: "Sonidos del Pacífico",
    contacto: "Carlos Hernández",
    correo: "ventas@sonidospacifico.com",
    telefono: "+503 7123-4567",
    pais: "El Salvador",
    ciudad: "San Salvador",
  },
  {
    id: "#01542d415s",
    logo: "/logos/groove.png",
    compania: "Groove Supply Co.",
    contacto: "Andrea Martínez",
    correo: "contacto@groovesupply.co",
    telefono: "+503 7234-5678",
    pais: "El Salvador",
    ciudad: "Santa Tecla",
  },
  {
    id: "#01242e415s",
    logo: "/logos/retro.png",
    compania: "RetroVinyl SV",
    contacto: "Luis Ramírez",
    correo: "pedidos@retrovinylsv.com",
    telefono: "+503 7345-6789",
    pais: "México", // 👈 prueba para ver el filtro dinámico
    ciudad: "CDMX",
  },
]

export default function ProvidersPage() {
  const [open, setOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [mode, setMode] = useState("view")
  const [countryFilter, setCountryFilter] = useState("all")

  // 🔥 países dinámicos
  const countries = [...new Set(proveedores.map(p => p.pais))]

  const options = [
    { label: "Todos", value: "all" },
    ...countries.map(c => ({ label: c, value: c }))
  ]

  // 🔥 filtro
  const filteredProviders = proveedores.filter((p) => {
    if (countryFilter === "all") return true
    return p.pais === countryFilter
  })

  return (
    <div onClick={() => setContextMenu(null)}>

      {/* TARJETAS */}
      <div className="flex gap-6 flex-wrap justify-evenly">
        <Card title="Total de proveedores" value="6" change="+5%" changeText="Que el mes pasado" color="#EFA4B1" />
        <Card title="Nuevos proveedores" value="1" change="+18%" changeText="Que el mes pasado" color="#A9BDE5" />
        <Card title="Proveedor más cotizado" value="Groove Supply Co." color="#E8D6A7" />
      </div>

      {/* HEADER */}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <InputGroupInlineStart />

          <FilterDropdown
            value={countryFilter}
            onChange={setCountryFilter}
            options={options} // 👈 dinámico
          />
        </div>

        <Button
          variant="cd"
          onClick={() => {
            setMode("edit")
            setSelectedProvider(null)
            setOpen(true)
          }}
        >
          <Plus className="w-5 h-5" />
          <p className="text-sm py-1 px-2">Agregar</p>
        </Button>
      </div>

      {/* TABLA */}
      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Compañía</TableHead>
              <TableHead>Nombre de contacto</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Ciudad</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProviders.map((p, index) => (
              <TableRow
                key={index}
                className="cursor-pointer"
                onDoubleClick={() => {
                  setSelectedProvider(p)
                  setMode("view")
                  setOpen(true)
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    provider: p,
                  })
                }}
              >
                <TableCell>
                  <img
                    src={p.logo}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.compania}</TableCell>
                <TableCell>{p.contacto}</TableCell>
                <TableCell>{p.correo}</TableCell>
                <TableCell>{p.telefono}</TableCell>
                <TableCell>{p.pais}</TableCell>
                <TableCell>{p.ciudad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MENU CONTEXTUAL */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-xl shadow-lg border w-40"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedProvider(contextMenu.provider)
              setMode("view")
              setOpen(true)
              setContextMenu(null)
            }}
          >
            Ver
          </div>

          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedProvider(contextMenu.provider)
              setMode("edit")
              setOpen(true)
              setContextMenu(null)
            }}
          >
            Editar
          </div>

          <div
            className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
            onClick={() => {
              console.log("Eliminar:", contextMenu.provider)
              setContextMenu(null)
            }}
          >
            Eliminar
          </div>
        </div>
      )}

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false)
          setSelectedProvider(null)
        }}
        title={
          !selectedProvider
            ? "Agregar proveedor"
            : mode === "view"
              ? "Detalle de proveedor"
              : "Editar proveedor"
        }
        size="lg"
      >
        <ProviderForm
          onClose={() => setOpen(false)}
          provider={selectedProvider}
          mode={mode}
        />
      </Modal>
    </div>
  )
}