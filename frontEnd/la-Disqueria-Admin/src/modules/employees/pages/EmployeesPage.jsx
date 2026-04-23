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
import { EmployeeForm } from "@/modules/employees/components/EmployeeForm"
import { FilterDropdown } from "@/global/components/FilterDropdown"

const empleados = [
    {
        id: "#EMP001",
        imagen: "/empleados/emp1.jpg",
        nombre: "Gabriela",
        apellido: "Castillo",
        correo: "gabriela@vinylstore.com",
        posicion: "Ventas",
        fecha: "12/02/2024",
        activo: "Activo",
    },
    {
        id: "#EMP002",
        imagen: "/empleados/emp2.jpg",
        nombre: "Carlos",
        apellido: "Hernández",
        correo: "carlos@vinylstore.com",
        posicion: "Administrador",
        fecha: "05/08/2023",
        activo: "Activo",
    },
    {
        id: "#EMP003",
        imagen: "/empleados/emp3.jpg",
        nombre: "Andrea",
        apellido: "Martínez",
        correo: "andrea@vinylstore.com",
        posicion: "Marketing",
        fecha: "20/01/2025",
        activo: "Inactivo",
    },
    // --- Nuevos Registros ---
    {
        id: "#EMP004",
        imagen: "/empleados/emp4.jpg",
        nombre: "Ricardo",
        apellido: "López",
        correo: "ricardo@vinylstore.com",
        posicion: "Logística",
        fecha: "15/03/2025",
        activo: "Activo",
    },
    {
        id: "#EMP005",
        imagen: "/empleados/emp5.jpg",
        nombre: "Elena",
        apellido: "Rivas",
        correo: "elena@vinylstore.com",
        posicion: "Curadora de Arte",
        fecha: "10/11/2024",
        activo: "Activo",
    },
    {
        id: "#EMP006",
        imagen: "/empleados/emp6.jpg",
        nombre: "Mauricio",
        apellido: "Pérez",
        correo: "mauricio@vinylstore.com",
        posicion: "Soporte Técnico",
        fecha: "02/02/2026",
        activo: "Activo",
    },
]

export default function EmployeesPage() {
    const [open, setOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [contextMenu, setContextMenu] = useState(null)
    const [mode, setMode] = useState("view")
    const [statusFilter, setStatusFilter] = useState("all")

    const filteredEmployees = empleados.filter((e) => {
        if (statusFilter === "all") return true
        return e.activo === statusFilter
    })

    return (
        <div onClick={() => setContextMenu(null)}>

            {/* TARJETAS */}
            <div className="flex gap-6 flex-wrap justify-evenly">
                <Card title="Total de empleados" value="6" change="+5%" changeText="Que el mes pasado" color="#EFA4B1" />
                <Card title="Nuevos empleados" value="1" change="+18%" changeText="Que el mes pasado" color="#A9BDE5" />
                <Card title="Empleado destacado" value="Andrea Martínez" color="#E8D6A7" />
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
                        setSelectedEmployee(null)
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
                            <TableHead>Posición</TableHead>
                            <TableHead>Fecha de contratación</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredEmployees.map((e, index) => (
                            <TableRow
                                key={index}
                                className="cursor-pointer"
                                onDoubleClick={() => {
                                    setSelectedEmployee(e)
                                    setMode("view")
                                    setOpen(true)
                                }}
                                onContextMenu={(ev) => {
                                    ev.preventDefault()
                                    setContextMenu({
                                        x: ev.clientX,
                                        y: ev.clientY,
                                        employee: e,
                                    })
                                }}
                            >
                                <TableCell>
                                    <img
                                        src={e.imagen}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </TableCell>
                                <TableCell>{e.id}</TableCell>
                                <TableCell>{e.nombre}</TableCell>
                                <TableCell>{e.apellido}</TableCell>
                                <TableCell>{e.correo}</TableCell>
                                <TableCell>{e.posicion}</TableCell>
                                <TableCell>{e.fecha}</TableCell>
                                <TableCell>{e.activo}</TableCell>
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
                            setSelectedEmployee(contextMenu.employee)
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
                            setSelectedEmployee(contextMenu.employee)
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
                            console.log("Eliminar:", contextMenu.employee)
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
                    setSelectedEmployee(null)
                }}
                title={
                    !selectedEmployee
                        ? "Agregar empleado"
                        : mode === "view"
                            ? "Detalle de empleado"
                            : "Editar empleado"
                }
                size="md"
            >
                <EmployeeForm
                    onClose={() => setOpen(false)}
                    employee={selectedEmployee}
                    mode={mode}
                />
            </Modal>
        </div>
    )
}