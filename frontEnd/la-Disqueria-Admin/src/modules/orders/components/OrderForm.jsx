"use client"

import { useState, useEffect } from "react"

import { Input } from "@/global/components/Input"
import { Label } from "@/global/components/Label"
import { Textarea } from "@/global/components/Textarea"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/global/components/InputGroup"
import { Button } from "@/global/components/button"
import { MoneyInput } from "@/global/components/MoneyInput"
import { FormDropdown } from "@/global/components/FormDropdown"
import { Search } from "lucide-react"
import { InputGroupInlineStart } from "@/global/components/SearchInput"

export function OrderForm({ onClose, order, mode = "edit" }) {

  const [internalMode, setInternalMode] = useState(mode)

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  const isReadOnly = internalMode === "view"

  const [cliente, setCliente] = useState("")
  const [status, setStatus] = useState("")

  const [metodoPago, setMetodoPago] = useState("")
  const [estadoPago, setEstadoPago] = useState("")

  const [subtotal, setSubtotal] = useState("")
  const [envio, setEnvio] = useState("")
  const [descuento, setDescuento] = useState("")
  const [total, setTotal] = useState("")

  const [calle, setCalle] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [departamento, setDepartamento] = useState("")
  const [pais, setPais] = useState("El Salvador")

  const [notas, setNotas] = useState("")

  const [selectedProducts, setSelectedProducts] = useState([])
  const [openProductsModal, setOpenProductsModal] = useState(false)

  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!order) return

    setCliente(order.cliente || "")
    setStatus(order.estado || "")

    setMetodoPago(order.metodo_de_pago || "")
    setEstadoPago(order.estado_pago || "")

    setSubtotal(order.subtotal?.toString() || "")
    setEnvio(order.envio?.toString() || "")
    setDescuento(order.descuento?.replace("%", "") || "")
    setTotal(order.total?.toString() || "")

    setCalle(order.direccion?.calle || "")
    setCiudad(order.direccion?.ciudad || "")
    setDepartamento(order.direccion?.departamento || "")
    setPais(order.direccion?.pais || "El Salvador")

    setNotas(order.notas || "")
  }, [order])

  useEffect(() => {
    const total = selectedProducts.reduce((acc, p) => {
      return acc + (p.precio * (parseInt(p.cantidad) || 0))
    }, 0)

    setSubtotal(total.toFixed(2))
  }, [selectedProducts])

  useEffect(() => {
    const sub = parseFloat(subtotal) || 0
    const ship = parseFloat(envio) || 0
    const disc = parseFloat(descuento) || 0

    const totalCalculado = (sub + ship) - (sub * (disc / 100))

    setTotal(totalCalculado.toFixed(2))
  }, [subtotal, envio, descuento])

  // 🧩 options
  const statusOptions = [
    { label: "Entregado", value: "Entregado" },
    { label: "En camino", value: "En camino" },
  ]

  const paymentMethodOptions = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Tarjeta de Débito", value: "Tarjeta de Débito" },
    { label: "Nequi", value: "Nequi" },
  ]

  const paymentStatusOptions = [
    { label: "No pagado", value: "No pagado" },
    { label: "Pagado", value: "Pagado" },
  ]

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

        {/* Cliente + Estado */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <Label>Cliente</Label>
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                disabled={isReadOnly}
              />
            </InputGroup>
          </div>

          <div>
            <Label>Estado</Label>
            <FormDropdown
              options={statusOptions}
              value={status}
              onChange={setStatus}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Productos */}
        <div>
          <Label>Productos</Label>

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

                <div className="text-sm font-medium">
                  ${p.precio}
                </div>

                <div className="flex items-center gap-2">

                  {/* BOTÓN RESTAR */}
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => {
                      const newList = [...selectedProducts]
                      if (newList[index].cantidad > 1) {
                        newList[index].cantidad--
                        setSelectedProducts(newList)
                      }
                    }}
                    className="w-7 h-7 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>

                  {/* CANTIDAD */}
                  <span className="w-6 text-center text-sm">
                    {p.cantidad}
                  </span>

                  {/* BOTÓN SUMAR */}
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => {
                      const newList = [...selectedProducts]
                      newList[index].cantidad++
                      setSelectedProducts(newList)
                    }}
                    className="w-7 h-7 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>

                </div>

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

        {/* Dinero */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Subtotal</Label>
            <MoneyInput value={subtotal} onChange={setSubtotal} disabled={isReadOnly} />
          </div>
          <div>
            <Label>Envío</Label>
            <MoneyInput value={envio} onChange={setEnvio} disabled={isReadOnly} />
          </div>
          <div>
            <Label>Descuento</Label>
            <div className="relative">
              <Input
                value={descuento}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "")
                  setDescuento(val)
                }}
                placeholder="0"
                disabled={isReadOnly}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                %
              </span>
            </div>
          </div>
          <div>
            <Label>Total</Label>
            <MoneyInput value={total} onChange={setTotal} disabled={isReadOnly} />
          </div>
        </div>

        {/* Dirección */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Calle</Label>
            <Input value={calle} onChange={(e) => setCalle(e.target.value)} disabled={isReadOnly} />
          </div>
          <div>
            <Label>Ciudad</Label>
            <Input value={ciudad} onChange={(e) => setCiudad(e.target.value)} disabled={isReadOnly} />
          </div>
          <div>
            <Label>Departamento</Label>
            <Input value={departamento} onChange={(e) => setDepartamento(e.target.value)} disabled={isReadOnly} />
          </div>
          <div>
            <Label>País</Label>
            <Input value={pais} onChange={(e) => setPais(e.target.value)} disabled={isReadOnly} />
          </div>
        </div>

        {/* Pago */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Método de pago</Label>
            <FormDropdown
              options={paymentMethodOptions}
              value={metodoPago}
              onChange={setMetodoPago}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <Label>Estado de pago</Label>
            <FormDropdown
              options={paymentStatusOptions}
              value={estadoPago}
              onChange={setEstadoPago}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* Notas */}
        <div>
          <Label>Notas</Label>
          <Textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            disabled={isReadOnly}
          />
        </div>

        {/* Botones */}
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

      {/* 🔥 MODAL DE PRODUCTOS MEJORADO */}
      {openProductsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-[800px] max-h-[85vh] flex flex-col p-5">

            {/* HEADER */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Seleccionar productos</h2>

              {/* 🔎 BUSCADOR */}
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
                        setSelectedProducts(prev => [
                          ...prev,
                          { ...prod, cantidad: 1 }
                        ])
                      }
                    }}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition ${isSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50"
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

              {filteredProducts.length === 0 && (
                <p className="text-sm text-gray-400 text-center mt-4">
                  No se encontraron productos
                </p>
              )}

            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4">

              <span className="text-sm text-gray-500">
                {selectedProducts.length} producto(s) seleccionados
              </span>

              <div className="flex gap-3">
                <Button variant="cancel" onClick={() => setOpenProductsModal(false)}>
                  Cancelar
                </Button>

                <Button
                  variant="cd"
                  onClick={() => setOpenProductsModal(false)}
                >
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