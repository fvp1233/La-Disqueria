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
import { InputGroupInlineStart } from "@/global/components/SearchInput"
import { Button } from "@/global/components/button"
import { Modal } from "@/global/components/Modal"
import { EmployeeForm } from "@/modules/employees/components/EmployeeForm"
import { FilterDropdown } from "@/global/components/FilterDropdown"
import { StatusBadge } from "@/global/components/StatusBadge"
import useEmployees from "@/modules/employees/hooks/useEmployees"

export default function EmployeesPage() {
    const {
        employees,
        loading,
        error,
        message,
        handleDelete,
        fetchEmployees,
    } = useEmployees()

    const [open, setOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [contextMenu, setContextMenu] = useState(null)
    const [mode, setMode] = useState("view")
    const [statusFilter, setStatusFilter] = useState("all")
    const [search, setSearch] = useState("")

    const handleSuccess = async () => {
        await fetchEmployees()
        setOpen(false)
        setSelectedEmployee(null)
    }

    const filteredEmployees = employees
        .filter((e) => {
            if (statusFilter === "all") return true
            return statusFilter === "Activo" ? e.is_active : !e.is_active
        })
        .filter((e) =>
            `${e.name || ""} ${e.last_name || ""}`.toLowerCase().includes(search.toLowerCase()) ||
            (e.email || "").toLowerCase().includes(search.toLowerCase())
        )

    if (loading) return <p className="p-6">Cargando empleados...</p>

    return (
        <div onClick={() => setContextMenu(null)}>

            {/* Mensajes */}
            {error && <p className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm">{error}</p>}
            {message && <p className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl text-sm">{message}</p>}

            {/* TARJETAS */}
            <div className="flex gap-6 flex-wrap justify-evenly">
                <Card title="Total de empleados" value={employees.length} color="#EFA4B1" />
                <Card title="Empleados activos" value={employees.filter((e) => e.is_active).length} color="#A9BDE5" />
                <Card title="Empleados inactivos" value={employees.filter((e) => !e.is_active).length} color="#E8D6A7" />
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
                            <TableHead>Id</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Apellido</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Posición</TableHead>
                            <TableHead>Fecha de contratación</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredEmployees.map((e, index) => (
                            <TableRow
                                key={e._id}
                                className="cursor-pointer hover:bg-gray-50 transition"
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
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{e.name}</TableCell>
                                <TableCell>{e.last_name}</TableCell>
                                <TableCell>{e.email}</TableCell>
                                <TableCell>{e.position}</TableCell>
                                <TableCell>{e.hire_date ? e.hire_date.substring(0, 10) : ""}</TableCell>
                                <TableCell>
                                    <StatusBadge estado={e.is_active ? "Activo" : "Inactivo"} />
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Pencil
                                        className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                        onClick={(ev) => {
                                            ev.stopPropagation()
                                            setSelectedEmployee(e)
                                            setMode("edit")
                                            setOpen(true)
                                        }}
                                    />
                                    <Trash2
                                        className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600"
                                        onClick={(ev) => {
                                            ev.stopPropagation()
                                            handleDelete(e._id)
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
                    <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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
                        className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer text-sm"
                        onClick={() => {
                            handleDelete(contextMenu.employee._id)
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
                    onClose={() => {
                        setOpen(false)
                        setSelectedEmployee(null)
                    }}
                    onSuccess={handleSuccess}
                    employee={selectedEmployee}
                    mode={mode}
                />
            </Modal>
        </div>
    )
}
