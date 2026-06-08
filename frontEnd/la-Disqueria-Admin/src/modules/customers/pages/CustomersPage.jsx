import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

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

// Servicios para consumir la API
import {
  getCustomers,
  deleteCustomer,
} from "../services/CustomerService";

export default function CustomersPage() {

  // Lista de clientes obtenidos desde la API
  const [customers, setCustomers] = useState([]);

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

  // Obtiene los clientes desde el backend
  const loadCustomers = async () => {
    const data = await getCustomers();

    if (data) {
      setCustomers(data);
    }
  };

  // Carga los clientes al iniciar la página
  useEffect(() => {
    loadCustomers();
  }, []);

  // Elimina un cliente
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este cliente?"
    );

    if (!confirmDelete) return;

    await deleteCustomer(id);

    // Refresca la tabla
    loadCustomers();
  };

  // Filtra los clientes según el estado seleccionado
  const filteredCustomers = customers.filter((c) => {

    if (statusFilter === "all") return true;

    return statusFilter === "Activo"
      ? c.is_active
      : !c.is_active;
  });

  return (

    // Al hacer click fuera del menú contextual lo cierra
    <div onClick={() => setContextMenu(null)}>

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
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {filteredCustomers.map((c) => (

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
                <TableCell>{c._id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.last_name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>

                {/* Dirección principal */}
                <TableCell>
                  {c.addresses?.length > 0
                    ? `${c.addresses[0].street}, ${c.addresses[0].city}`
                    : "Sin dirección"}
                </TableCell>

                {/* Estado del cliente */}
                <TableCell>
                  {c.is_active ? "Activo" : "Inactivo"}
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

          // Refresca la tabla al cerrar
          loadCustomers();
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

            // Refresca los datos después de guardar
            loadCustomers();
          }}
          customer={selectedCustomer}
          mode={mode}
        />
      </Modal>

    </div>
  );
}