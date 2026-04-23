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

export function OrderForm({ onClose, order, mode = "edit" }) {

  const [internalMode, setInternalMode] = useState(mode)

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  const isReadOnly = internalMode === "view"

  // 🔥 estados
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

  // 🧠 cargar data
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

  return (
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
        <div className={`border rounded-xl p-4 h-32 flex items-center justify-center ${isReadOnly ? "text-gray-400" : "text-red-400 cursor-pointer"
          }`}>
          + Agregar producto
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
  )
}