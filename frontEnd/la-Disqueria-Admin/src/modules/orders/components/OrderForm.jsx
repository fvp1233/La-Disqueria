"use client"

import { useEffect, useState } from "react"

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
import useOrders from "@/modules/orders/hooks/useOrders"
import useCustomers from "@/modules/customers/hooks/useCustomers"
import useProducts from "@/modules/providers/hooks/useProducts"

const productModelByType = {
  vinyl: "Vinyl",
  cd: "CD",
  turntable: "Turntable",
  accessory: "Accessory",
}

export function OrderForm({ onClose, onSuccess, order, mode = "edit" }) {

  const [internalMode, setInternalMode] = useState(mode)

  useEffect(() => {
    setInternalMode(mode)
  }, [mode])

  const isReadOnly = internalMode === "view"
  const isNewOrder = !order

  const { saveOrder, submitting, error } = useOrders()
  const { customers } = useCustomers()
  const { allProducts } = useProducts()

  const [customerId, setCustomerId] = useState("")
  const [customerSearch, setCustomerSearch] = useState("")
  const [showCustomerOptions, setShowCustomerOptions] = useState(false)

  const [status, setStatus] = useState("Pendiente")
  const [metodoPago, setMetodoPago] = useState("")

  const [envio, setEnvio] = useState("0")

  const [calle, setCalle] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [departamento, setDepartamento] = useState("")
  const [pais, setPais] = useState("El Salvador")

  const [notas, setNotas] = useState("")

  const [items, setItems] = useState([])
  const [openProductsModal, setOpenProductsModal] = useState(false)
  const [productSearch, setProductSearch] = useState("")

  useEffect(() => {
    if (!order) {
      setCustomerId("")
      setCustomerSearch("")
      setStatus("Pendiente")
      setMetodoPago("")
      setEnvio("0")
      setCalle("")
      setCiudad("")
      setDepartamento("")
      setPais("El Salvador")
      setNotas("")
      setItems([])
      return
    }

    setCustomerId(order.customerId?._id || order.customerId || "")
    setCustomerSearch(order.customerId?.name || "")
    setStatus(order.status || "Pendiente")
    setMetodoPago(order.payment_method || "")
    setEnvio(order.shipping?.toString() || "0")

    setCalle(order.shipping_address?.street || "")
    setCiudad(order.shipping_address?.city || "")
    setDepartamento(order.shipping_address?.state || "")
    setPais(order.shipping_address?.country || "El Salvador")

    setNotas(order.notes || "")
    setItems(order.items || [])
  }, [order])

  const subtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  )
  const total = subtotal + (parseFloat(envio) || 0)

  const statusOptions = [
    { label: "Pendiente", value: "Pendiente" },
    { label: "En camino", value: "En camino" },
    { label: "Entregado", value: "Entregado" },
    { label: "Cancelado", value: "Cancelado" },
  ]

  const paymentMethodOptions = [
    { label: "Efectivo", value: "Efectivo" },
    { label: "Tarjeta de Débito", value: "Tarjeta de Débito" },
    { label: "Nequi", value: "Nequi" },
  ]

  const filteredCustomers = customers.filter((c) =>
    `${c.name || ""} ${c.last_name || ""}`
      .toLowerCase()
      .includes(customerSearch.toLowerCase())
  )

  const filteredProducts = allProducts.filter((p) =>
    p.displayName?.toLowerCase().includes(productSearch.toLowerCase())
  )

  const toggleProduct = (product) => {
    const exists = items.find((item) => item.productId === product._id)
    if (exists) {
      setItems((prev) => prev.filter((item) => item.productId !== product._id))
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: product._id,
          productModel: productModelByType[product.type] || "Accessory",
          type: product.type,
          title: product.displayName,
          price: product.price || 0,
          image: product.images?.[0]?.image || "",
          quantity: 1,
        },
      ])
    }
  }

  const updateQuantity = (productId, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    )
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!customerId) return

    const payload = {
      customerId,
      status,
      shipping_address: {
        street: calle,
        city: ciudad,
        state: departamento,
        country: pais,
      },
      payment_method: metodoPago,
      notes: notas,
    }

    // Los items solo se envían al crear: el endpoint de actualización no los admite
    if (isNewOrder) {
      payload.items = items.map(
        ({ productId, productModel, type, title, price, image, quantity }) => ({
          productId,
          productModel,
          type,
          title,
          price,
          image,
          quantity,
        })
      )
    }

    const success = await saveOrder(order?._id || null, payload)
    if (success) onSuccess()
  }

  return (
    <>
      {error && <p className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-xs">{error}</p>}

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>

        {/* Cliente + Estado */}
        <div className="grid grid-cols-2 gap-4">

          <div className="relative">
            <Label>Cliente</Label>
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value)
                  setCustomerId("")
                  setShowCustomerOptions(true)
                }}
                onFocus={() => setShowCustomerOptions(true)}
                placeholder="Buscar cliente..."
                disabled={isReadOnly}
              />
            </InputGroup>

            {showCustomerOptions && !isReadOnly && customerSearch && !customerId && (
              <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border rounded-lg shadow-lg">
                {filteredCustomers.length === 0 && (
                  <p className="p-2 text-xs text-gray-400">Sin resultados</p>
                )}
                {filteredCustomers.map((c) => (
                  <div
                    key={c._id}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCustomerId(c._id)
                      setCustomerSearch(`${c.name} ${c.last_name}`)
                      setShowCustomerOptions(false)
                    }}
                  >
                    {c.name} {c.last_name} — {c.email}
                  </div>
                ))}
              </div>
            )}
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

            {items.length === 0 && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Sin productos en esta orden
              </p>
            )}

            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 border rounded-lg p-2">

                {item.image ? (
                  <img src={item.image} className="w-10 h-10 rounded-md object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-200" />
                )}

                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.productModel}</p>
                </div>

                <div className="text-sm font-medium">
                  ${item.price}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isReadOnly || !isNewOrder}
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="w-7 h-7 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>

                  <span className="w-6 text-center text-sm">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    disabled={isReadOnly || !isNewOrder}
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="w-7 h-7 rounded-md border text-sm hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

              </div>
            ))}

            {!isReadOnly && isNewOrder && (
              <button
                type="button"
                onClick={() => setOpenProductsModal(true)}
                className="text-sm text-red-400 mt-2 hover:bg-red-50 border p-1.5 rounded"
              >
                + Agregar producto
              </button>
            )}

            {!isNewOrder && (
              <p className="text-[11px] text-gray-400 mt-1">
                Los productos de una orden ya creada no se pueden modificar.
              </p>
            )}
          </div>
        </div>

        {/* Dinero */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Subtotal</Label>
            <MoneyInput value={subtotal.toFixed(2)} onChange={() => {}} disabled />
          </div>
          <div>
            <Label>Envío</Label>
            <MoneyInput value={envio} onChange={setEnvio} disabled={isReadOnly} />
          </div>
          <div>
            <Label>Total</Label>
            <MoneyInput value={total.toFixed(2)} onChange={() => {}} disabled />
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

          <Button type="button" variant="cancel" onClick={onClose}>
            {isReadOnly ? "Cerrar" : "Cancelar"}
          </Button>

          {isReadOnly && (
            <Button type="button" onClick={() => setInternalMode("edit")} variant="cd">
              Editar
            </Button>
          )}

          {!isReadOnly && (
            <Button type="submit" variant="cd" disabled={submitting}>
              {submitting ? "Guardando..." : order ? "Actualizar" : "Guardar"}
            </Button>
          )}
        </div>

      </form>

      {/* MODAL DE PRODUCTOS */}
      {openProductsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-[800px] max-h-[85vh] flex flex-col p-5">

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Seleccionar productos</h2>

              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="mt-3 w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">

              {filteredProducts.map((prod) => {
                const isSelected = items.find((item) => item.productId === prod._id)

                return (
                  <div
                    key={prod._id}
                    onClick={() => toggleProduct(prod)}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition ${isSelected ? "bg-red-50 border-red-300" : "hover:bg-gray-50"
                      }`}
                  >
                    {prod.images?.[0]?.image ? (
                      <img src={prod.images[0].image} className="w-14 h-14 rounded-md object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-gray-200" />
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-semibold">{prod.displayName}</p>
                      <p className="text-xs text-gray-500">{productModelByType[prod.type] || prod.type}</p>
                    </div>

                    <div className="text-sm font-semibold w-20 text-right">
                      ${prod.price || "-"}
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

            <div className="flex justify-between items-center mt-4">

              <span className="text-sm text-gray-500">
                {items.length} producto(s) seleccionados
              </span>

              <Button variant="cancel" onClick={() => setOpenProductsModal(false)}>
                Cerrar
              </Button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}
