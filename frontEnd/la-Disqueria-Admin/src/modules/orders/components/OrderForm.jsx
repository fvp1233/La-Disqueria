"use client"

import { useState } from "react"

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

export function OrderForm({ onClose }) {

    const [status, setStatus] = useState("pending")

    const statusOptions = [
        { label: "Pendiente", value: "pending" },
        { label: "En progreso", value: "in_progress" },
        { label: "Completado", value: "completed" },
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
                        <InputGroupInput placeholder="Buscar cliente..." />
                    </InputGroup>
                </div>

                <div className="w-full">
                    <Label>Estado</Label>
                    <FormDropdown
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                    />

                </div>
            </div>

            {/* Productos */}
            <div>
                <Label>Productos</Label>
                <div className="border rounded-xl p-4 h-32 flex items-center justify-center text-red-400 cursor-pointer">
                    + Agregar producto
                </div>
            </div>

            {/* Subtotal / Envío / Descuento / Total */}
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <Label>Subtotal</Label>
                    <MoneyInput />
                </div>
                <div>
                    <Label>Envío</Label>
                    <MoneyInput />
                </div>
                <div>
                    <Label>Descuento</Label>
                    <MoneyInput />
                </div>
                <div>
                    <Label>Total</Label>
                    <MoneyInput />
                </div>
            </div>

            {/* Dirección */}
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <Label>Calle</Label>
                    <Input />
                </div>
                <div>
                    <Label>Ciudad</Label>
                    <Input />
                </div>
                <div>
                    <Label>Departamento</Label>
                    <Input />
                </div>
                <div>
                    <Label>País</Label>
                    <Input defaultValue="El Salvador" />
                </div>
            </div>

            {/* Pago */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Método de pago</Label>
                    <Input defaultValue="Efectivo" />
                </div>
                <div>
                    <Label>Estado de pago</Label>
                    <Input defaultValue="No pagado" />
                </div>
            </div>

            {/* Notas */}
            <div>
                <Label>Notas</Label>
                <Textarea />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="cancel" onClick={onClose}>
                    Cancelar
                </Button>

                <Button type="submit" variant="cd">
                    Guardar
                </Button>
            </div>

        </form>
    )
}