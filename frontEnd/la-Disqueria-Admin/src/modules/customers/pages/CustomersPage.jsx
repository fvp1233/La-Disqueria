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
import { CustomerForm } from "@/modules/customers/components/CustomerForm"
import { FilterDropdown } from "@/global/components/FilterDropdown"

const clientes = [
  {
    id: "#CL001",
    imagen: "/clientes/c1.jpg",
    nombre: "Gabriela",
    apellido: "Castillo",
    correo: "gabriela@gmail.com",
    telefono: "+503 7123-4567",
    direccion: "Colonia Escalón, San Salvador",
    activo: "Activo",
  },
  {
    id: "#CL002",
    imagen: "/clientes/c2.jpg",
    nombre: "Carlos",
    apellido: "Hernández",
    correo: "carlos@gmail.com",
    telefono: "+503 7234-5678",
    direccion: "Santa Tecla, La Libertad",
    activo: "Activo",
  },
  {
    id: "#CL003",
    imagen: "/clientes/c3.jpg",
    nombre: "Andrea",
    apellido: "Martínez",
    correo: "andrea@gmail.com",
    telefono: "+503 7345-6789",
    direccion: "San Miguel",
    activo: "Inactivo",
  },
  // --- Nuevos Registros ---
  {
    id: "#CL004",
    imagen: "/clientes/c4.jpg",
    nombre: "Roberto",
    apellido: "Guzmán",
    correo: "roberto.g@outlook.com",
    telefono: "+503 7456-1122",
    direccion: "Antiguo Cuscatlán, La Libertad",
    activo: "Activo",
  },
  {
    id: "#CL005",
    imagen: "/clientes/c5.jpg",
    nombre: "Lucía",
    apellido: "Villalobos",
    correo: "lu.villa@yahoo.com",
    telefono: "+503 7567-3344",
    direccion: "Colonia San Benito, San Salvador",
    activo: "Activo",
  },
  {
    id: "#CL006",
    imagen: "/clientes/c6.jpg",
    nombre: "Fernando",
    apellido: "Quinteros",
    correo: "f.quinteros@gmail.com",
    telefono: "+503 7678-5566",
    direccion: "Sonsonate, Centro",
    activo: "Inactivo",
  },
];

export default function CustomersPage() {
  const [open, setOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [mode, setMode] = useState("view")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCustomers = clientes.filter((c) => {
    if (statusFilter === "all") return true
    return c.activo === statusFilter
  })

  return (
    <div onClick={() => setContextMenu(null)}>

      {/* TARJETAS */}
      <div className="flex gap-6 flex-wrap justify-evenly">
        <Card title="Total de clientes" value="6" change="+5%" changeText="Que el mes pasado" color="#EFA4B1" />
        <Card title="Nuevos clientes" value="1" change="+18%" changeText="Que el mes pasado" color="#A9BDE5" />
        <Card title="Cliente destacado" value="Andrea Martínez" color="#E8D6A7" />
      </div>

      {/* HEADER */}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <InputGroupInlineStart />

          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Todos", value: "all" },
              { label: "Activo", value: "Activo" },
              { label: "Inactivo", value: "Inactivo" },
            ]}
          />
        </div>

        <Button
          variant="cd"
          onClick={() => {
            setMode("edit")
            setSelectedCustomer(null)
            setOpen(true)
          }}
        >
          <Plus className="w-5 h-5" />
          <p className="text-sm py-1 px-2">Agregar</p>
        </Button>
      </div>

      {/* TABLA */}
      <div className="mt-5 w-full mb-5">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCustomers.map((c, index) => (
              <TableRow
                key={index}
                className="cursor-pointer"
                onDoubleClick={() => {
                  setSelectedCustomer(c)
                  setMode("view")
                  setOpen(true)
                }}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    customer: c,
                  })
                }}
              >
                <TableCell>
                  <img
                    src={c.imagen}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.apellido}</TableCell>
                <TableCell>{c.correo}</TableCell>
                <TableCell className="whitespace-nowrap">{c.telefono}</TableCell>
                <TableCell>{c.direccion}</TableCell>
                <TableCell>{c.activo}</TableCell>
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
              setSelectedCustomer(contextMenu.customer)
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
              setSelectedCustomer(contextMenu.customer)
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
              console.log("Eliminar:", contextMenu.customer)
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
          setSelectedCustomer(null)
        }}
        title={
          !selectedCustomer
            ? "Agregar cliente"
            : mode === "view"
              ? "Detalle de cliente"
              : "Editar cliente"
        }
        size="md"
      >
        <CustomerForm
          onClose={() => setOpen(false)}
          customer={selectedCustomer}
          mode={mode}
        />
      </Modal>
    </div>
  )
}