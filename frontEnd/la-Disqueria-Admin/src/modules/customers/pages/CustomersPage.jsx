import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

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

import {
  getCustomers,
  deleteCustomer,
} from "../services/CustomerService";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [mode, setMode] = useState("view");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadCustomers = async () => {
    const data = await getCustomers();
    if (data) {
      setCustomers(data);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este cliente?"
    );

    if (!confirmDelete) return;

    await deleteCustomer(id);

    loadCustomers();
  };

  const filteredCustomers = customers.filter((c) => {
    if (statusFilter === "all") return true;

    return statusFilter === "Activo"
      ? c.is_active
      : !c.is_active;
  });

  return (
    <div onClick={() => setContextMenu(null)}>
      {/* TARJETAS */}
      <div className="flex gap-6 flex-wrap justify-evenly">
        <Card
          title="Total de clientes"
          value={customers.length}
          color="#EFA4B1"
        />

        <Card
          title="Clientes activos"
          value={customers.filter((c) => c.is_active).length}
          color="#A9BDE5"
        />

        <Card
          title="Clientes inactivos"
          value={customers.filter((c) => !c.is_active).length}
          color="#E8D6A7"
        />
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
            setMode("edit");
            setSelectedCustomer(null);
            setOpen(true);
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
                onDoubleClick={() => {
                  setSelectedCustomer(c);
                  setMode("view");
                  setOpen(true);
                }}
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

                <TableCell>
                  {c.addresses?.length > 0
                    ? `${c.addresses[0].street}, ${c.addresses[0].city}`
                    : "Sin dirección"}
                </TableCell>

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

          // refresca la tabla al cerrar
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
            loadCustomers();
          }}
          customer={selectedCustomer}
          mode={mode}
        />
      </Modal>
    </div>
  );
}