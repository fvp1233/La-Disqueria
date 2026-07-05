import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Componentes reutilizables
import Card from "@/global/components/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { Button } from "@/global/components/button";
import { Modal } from "@/global/components/Modal";
import { CustomerForm } from "@/modules/customers/components/CustomerForm";
import { FilterDropdown } from "@/global/components/FilterDropdown";

// Hook con el GET/POST/PUT/DELETE reales de clientes
import useCustomers from "@/modules/customers/hooks/useCustomers";

export default function CustomersPage() {

  const {
    customers,
    loading,
    error,
    message,
    handleDelete,
    fetchCustomers,
  } = useCustomers();

  // Controla la apertura del modal
  const [open, setOpen] = useState(false);

  // Cliente seleccionado para ver o editar
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Información del menú contextual
  const [contextMenu, setContextMenu] = useState(null);

  // Modo del formulario: view o edit
  const [mode, setMode] = useState("view");

  // Filtro de estado (Todos, Activo, Inactivo)
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSuccess = async () => {
    await fetchCustomers();
    setOpen(false);
    setSelectedCustomer(null);
  };

  // Filtra los clientes según el estado seleccionado
  const filteredCustomers = customers.filter((c) => {

    if (statusFilter === "all") return true;

    return statusFilter === "Activo"
      ? c.is_active
      : !c.is_active;
  });

  if (loading) return <p className="p-6">Cargando clientes...</p>;

  return (

    // Al hacer click fuera del menú contextual lo cierra
    <div onClick={() => setContextMenu(null)}>

      {/* Mensajes */}
      {error && <p className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm">{error}</p>}
      {message && <p className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl text-sm">{message}</p>}

      {/* TARJETAS DE RESUMEN */}
      <div className="flex gap-6 flex-wrap justify-evenly">

        {/* Total de clientes */}
        <Card
          title="Total de clientes"
          value={customers.length}
          color="#EFA4B1"
        />

        {/* Clientes activos */}
        <Card
          title="Clientes activos"
          value={customers.filter((c) => c.is_active).length}
          color="#A9BDE5"
        />

        {/* Clientes inactivos */}
        <Card
          title="Clientes inactivos"
          value={customers.filter((c) => !c.is_active).length}
          color="#E8D6A7"
        />

      </div>

      {/* HEADER */}
      <div className="mt-8 flex justify-between items-center">

        <div className="flex gap-4 items-center">

          {/* Barra de búsqueda */}
          <InputGroupInlineStart />

          {/* Filtro por estado */}
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

        {/* Botón para agregar un nuevo cliente */}
        <Button
          variant="cd"
          onClick={() => {
            setMode("edit");
            setSelectedCustomer(null);
            setOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          <p className="text-sm py-1 px-2">Agregar</p>
        </Button>

      </div>

      {/* TABLA DE CLIENTES */}
      <div className="mt-5 w-full mb-5">

        <Table className="min-w-[1000px]">

          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {filteredCustomers.map((c, index) => (

              <TableRow
                key={c._id}
                className="cursor-pointer"

                // Doble click para ver detalles
                onDoubleClick={() => {
                  setSelectedCustomer(c);
                  setMode("view");
                  setOpen(true);
                }}

                // Click derecho para mostrar menú contextual
                onContextMenu={(e) => {
                  e.preventDefault();

                  setContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    customer: c,
                  });
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.last_name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>

                {/* Estado del cliente */}
                <TableCell>
                  {c.is_active ? "Activo" : "Inactivo"}
                </TableCell>

                {/* Acciones */}
                <TableCell className="flex gap-2">
                  <Pencil
                    className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(c);
                      setMode("edit");
                      setOpen(true);
                    }}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c._id);
                    }}
                  />
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

      {/* MENÚ CONTEXTUAL */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-xl shadow-lg border w-40"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >

          {/* Ver cliente */}
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedCustomer(contextMenu.customer);
              setMode("view");
              setOpen(true);
              setContextMenu(null);
            }}
          >
            Ver
          </div>

          {/* Editar cliente */}
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setSelectedCustomer(contextMenu.customer);
              setMode("edit");
              setOpen(true);
              setContextMenu(null);
            }}
          >
            Editar
          </div>

          {/* Eliminar cliente */}
          <div
            className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
            onClick={() => {
              handleDelete(contextMenu.customer._id);
              setContextMenu(null);
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
          setOpen(false);
          setSelectedCustomer(null);
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
          onClose={() => {
            setOpen(false);
            setSelectedCustomer(null);
          }}
          onSuccess={handleSuccess}
          customer={selectedCustomer}
          mode={mode}
        />
      </Modal>

    </div>
  );
}