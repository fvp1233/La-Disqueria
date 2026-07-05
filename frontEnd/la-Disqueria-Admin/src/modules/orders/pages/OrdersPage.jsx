import { useState } from "react"

import { Plus, Pencil, Trash2 } from "lucide-react"

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
import useOrders from "@/modules/orders/hooks/useOrders"

export default function OrdersPage() {

  const {
    orders,
    loading,
    error,
    message,
    handleDelete,
    fetchOrders,
  } = useOrders()

  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [mode, setMode] = useState("view")

  const handleSuccess = async () => {
    await fetchOrders()
    setOpen(false)
    setSelectedOrder(null)
  }

  const filteredOrders = orders
    .filter((order) => statusFilter === "all" || order.status === statusFilter)
    .filter((order) =>
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerId?.name?.toLowerCase().includes(search.toLowerCase())
    )

  const totalIngresos = orders.reduce((acc, order) => acc + (order.total || 0), 0)
  const pendientes = orders.filter((o) => o.status === "Pendiente" || o.status === "pendiente").length
  const entregadas = orders.filter((o) => o.status === "Entregado").length

  if (loading) return <p className="p-6">Cargando órdenes...</p>

  return (
    <div onClick={() => setContextMenu(null)}>

      {/* Mensajes */}
      {error && <p className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm">{error}</p>}
      {message && <p className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl text-sm">{message}</p>}

      {/* TARJETAS */}
      <div className="flex gap-6 flex-wrap">
        <Card title="Total de órdenes" value={orders.length} color="#EFA4B1" />
        <Card title="Ingresos totales" value={`$${totalIngresos.toLocaleString()}`} color="#A9BDE5" />
        <Card title="Pendientes" value={pendientes} color="#E8D6A7" />
        <Card title="Entregadas" value={entregadas} color="#E57373" />
      </div>

      {/* HEADER */}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <InputGroupInlineStart value={search} onChange={(e) => setSearch(e.target.value)} />

          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "Todos", value: "all" },
              { label: "Pendiente", value: "Pendiente" },
              { label: "En camino", value: "En camino" },
              { label: "Entregado", value: "Entregado" },
              { label: "Cancelado", value: "Cancelado" },
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
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Método de pago</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order._id}
                className="cursor-pointer hover:bg-gray-50 transition"

                onDoubleClick={() => {
                  setSelectedOrder(order)
                  setMode("view")
                  setOpen(true)
                }}

                onContextMenu={(e) => {
                  e.preventDefault()
                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    order,
                  })
                }}
              >
                <TableCell>{order.order_number}</TableCell>
                <TableCell>{order.customerId?.name || "-"}</TableCell>
                <TableCell>${(order.total || 0).toFixed(2)}</TableCell>
                <TableCell><StatusBadge estado={order.status} /></TableCell>
                <TableCell>{order.payment_method || "-"}</TableCell>
                <TableCell>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Pencil
                    className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOrder(order)
                      setMode("edit")
                      setOpen(true)
                    }}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(order._id)
                    }}
                  />
                </TableCell>
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
          onClick={(e) => e.stopPropagation()}
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
              handleDelete(contextMenu.order._id)
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
          onClose={() => {
            setOpen(false)
            setSelectedOrder(null)
          }}
          onSuccess={handleSuccess}
          order={selectedOrder}
          mode={mode}
        />
      </Modal>
    </div>
  )
}
