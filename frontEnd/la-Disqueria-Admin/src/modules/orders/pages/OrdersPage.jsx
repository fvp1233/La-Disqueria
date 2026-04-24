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
import { StatusBadge } from "@/global/components/StatusBadge"
import { InputGroupInlineStart } from "@/global/components/SearchInput"
import { Button } from "@/global/components/button"
import { Modal } from "@/global/components/Modal"
import { OrderForm } from "@/modules/orders/components/OrderForm"
import { FilterDropdown } from "@/global/components/FilterDropdown"

const ordenes = [
  {
    orderid: "#01542d415s",
    cliente: "Gabriela Isabel Castillo",
    precio: "$89.54",
    estado: "Entregado",
    descuento: "10%",
    metodo_de_pago: "Nequi",
    fecha_de_entrega: "06 de abril del 2026",

    subtotal: 99.54,
    envio: 0,
    total: 89.54,
    direccion: {
      calle: "Colonia Escalón",
      ciudad: "San Salvador",
      departamento: "San Salvador",
      pais: "El Salvador",
    },
    estado_pago: "Pagado",
    notas: "Cliente frecuente",
  },
  {
    orderid: "#01542d415s",
    cliente: "Victoria Guadalupe Mena",
    precio: "$78.99",
    estado: "Entregado",
    descuento: "-",
    metodo_de_pago: "Tarjeta de Débito",
    fecha_de_entrega: "17 de marzo del 2026",

    subtotal: 78.99,
    envio: 0,
    total: 78.99,
    direccion: {
      calle: "Colonia Miralvalle",
      ciudad: "Santa Tecla",
      departamento: "La Libertad",
      pais: "El Salvador",
    },
    estado_pago: "Pagado",
    notas: "",
  },
  {
    orderid: "#01242e415s",
    cliente: "Isabel del Carmén Portillo",
    precio: "$48.99",
    estado: "Entregado",
    descuento: "20%",
    metodo_de_pago: "Efectivo",
    fecha_de_entrega: "11 de marzo del 2026",

    subtotal: 61.24,
    envio: 0,
    total: 48.99,
    direccion: {
      calle: "Colonia San Benito",
      ciudad: "San Salvador",
      departamento: "San Salvador",
      pais: "El Salvador",
    },
    estado_pago: "Pagado",
    notas: "Aplicar descuento especial",
  },
  {
    orderid: "#01242e415s",
    cliente: "Fabiola Nicole Fuentes",
    precio: "$104.99",
    estado: "En camino",
    descuento: "-",
    metodo_de_pago: "Nequi",
    fecha_de_entrega: "-",

    subtotal: 99.99,
    envio: 5,
    total: 104.99,
    direccion: {
      calle: "Colonia Flor Blanca",
      ciudad: "San Salvador",
      departamento: "San Salvador",
      pais: "El Salvador",
    },
    estado_pago: "No pagado",
    notas: "Entrega urgente",
  },
  {
    orderid: "#01875f415g",
    cliente: "Monica Alejandra Giron",
    precio: "$64.99",
    estado: "En camino",
    descuento: "-",
    metodo_de_pago: "Efectivo",
    fecha_de_entrega: "-",

    subtotal: 59.99,
    envio: 5,
    total: 64.99,
    direccion: {
      calle: "Colonia Escalón",
      ciudad: "San Salvador",
      departamento: "San Salvador",
      pais: "El Salvador",
    },
    estado_pago: "No pagado",
    notas: "",
  },
];

export default function OrdersPage() {

  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [mode, setMode] = useState("view")

  const filteredOrders = ordenes.filter((orden) => {
    if (statusFilter === "all") return true
    return orden.estado === statusFilter
  })

  return (
    <div onClick={() => setContextMenu(null)}>

      {/* TARJETAS */}
      <div className="flex gap-6 flex-wrap">
        <Card title="Total de accesorios" value="150" change="+5%" changeText="Que el mes pasado" color="#EFA4B1" />
        <Card title="Ingresos de accesorios" value="$70,540" change="+18%" changeText="Que el mes pasado" color="#A9BDE5" />
        <Card title="Con bajo stock" value="8" change="+33%" changeText="Que el mes pasado" color="#E8D6A7" />
        <Card title="Accesorios agotados" value="5" change="-29%" changeText="Que el mes pasado" color="#E57373" />
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
              { label: "Entregado", value: "Entregado" },
              { label: "En camino", value: "En camino" },
            ]}
          />
        </div>

        <Button
          variant="cd"
          onClick={() => {
            setMode("edit")
            setSelectedOrder(null)
            setOpen(true)
          }}
        >
          <Plus className="w-5 h-5" />
          <p className="text-sm py-1 px-2">Agregar</p>
        </Button>
      </div>

      {/* TABLA */}
      <div className="mt-5 mb-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden Id</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Método de pago</TableHead>
              <TableHead>Fecha de entrega</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((p, index) => (
              <TableRow
                key={index}
                className="cursor-pointer"

                onDoubleClick={() => {
                  setSelectedOrder(p)
                  setMode("view")
                  setOpen(true)
                }}

                onContextMenu={(e) => {
                  e.preventDefault()
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    order: p,
                  })
                }}
              >
                <TableCell>{p.orderid}</TableCell>
                <TableCell>{p.cliente}</TableCell>
                <TableCell>{p.precio}</TableCell>
                <TableCell><StatusBadge estado={p.estado} /></TableCell>
                <TableCell>{p.descuento}</TableCell>
                <TableCell>{p.metodo_de_pago}</TableCell>
                <TableCell>{p.fecha_de_entrega}</TableCell>
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
          {/* VER */}
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedOrder(contextMenu.order)
              setMode("view")
              setOpen(true)
              setContextMenu(null)
            }}
          >
            Ver
          </div>

          {/* EDITAR */}
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedOrder(contextMenu.order)
              setMode("edit")
              setOpen(true)
              setContextMenu(null)
            }}
          >
            Editar
          </div>

          {/* ELIMINAR */}
          <div
            className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
            onClick={() => {
              console.log("Eliminar:", contextMenu.order)
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
          setSelectedOrder(null)
        }}
        title={
          !selectedOrder
            ? "Agregar orden"
            : mode === "view"
              ? "Detalle de orden"
              : "Editar orden"
        }
        size="full"
      >
        <OrderForm
          onClose={() => setOpen(false)}
          order={selectedOrder}
          mode={mode}
        />
      </Modal>
    </div>
  )
}