import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import Card from "@/global/components/Card";
import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from "@/global/components/Table";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { Button } from "@/global/components/button";
import { Modal } from "@/global/components/Modal";
import { ProviderForm } from "@/modules/providers/components/ProviderForm";
import { FilterDropdown } from "@/global/components/FilterDropdown";
import useSuppliers from "@/modules/providers/hooks/useSuppliers";

export default function ProvidersPage() {
  const {
    suppliers,
    loading,
    error,
    message,
    handleDelete,
    fetchSuppliers,
  } = useSuppliers();

  const [open, setOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [mode, setMode] = useState("view");
  const [countryFilter, setCountryFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleSuccess = async () => {
    await fetchSuppliers();
    setOpen(false);
    setSelectedProvider(null);
  };

  const countries = [...new Set(suppliers.map(s => s.country).filter(Boolean))];
  const options = [
    { label: "Todos", value: "all" },
    ...countries.map(c => ({ label: c, value: c })),
  ];

  const filtered = suppliers
    .filter(s => countryFilter === "all" || s.country === countryFilter)
    .filter(s =>
      (s.companny || s.company || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.contact_name || "").toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return <p className="p-6">Cargando proveedores...</p>;

  return (
    <div onClick={() => setContextMenu(null)}>

      {/* Mensajes */}
      {error && <p className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm">{error}</p>}
      {message && <p className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl text-sm">{message}</p>}

      {/* Cards */}
      <div className="flex gap-6 flex-wrap justify-evenly">
        <Card
          title="Total de proveedores"
          value={suppliers.length}
          change="+5%"
          changeText="Que el mes pasado"
          color="#EFA4B1"
        />
        <Card
          title="Países"
          value={countries.length}
          change="+2%"
          changeText="Que el mes pasado"
          color="#A9BDE5"
        />
        <Card
          title="Con catálogo"
          value={suppliers.filter(s => s.catalog?.length > 0).length}
          color="#E8D6A7"
        />
      </div>

      {/* Header */}
      <div className="mt-8 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <InputGroupInlineStart
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FilterDropdown
            value={countryFilter}
            onChange={setCountryFilter}
            options={options}
          />
        </div>
        <Button
          variant="cd"
          onClick={() => {
            setMode("edit");
            setSelectedProvider(null);
            setOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          <p className="text-sm py-1 px-2">Agregar</p>
        </Button>
      </div>

      {/* Tabla */}
      <div className="mt-5 w-full mb-5">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead>Compañía</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Catálogo</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((s) => (
              <TableRow
                key={s._id}
                className="cursor-pointer hover:bg-gray-50 transition"
                onDoubleClick={() => {
                  setSelectedProvider(s);
                  setMode("view");
                  setOpen(true);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY, provider: s });
                }}
              >
                <TableCell>{s.companny || s.company}</TableCell>
                <TableCell>{s.contact_name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell className="whitespace-nowrap">{s.phone}</TableCell>
                <TableCell>{s.country}</TableCell>
                <TableCell>{s.city}</TableCell>
                <TableCell>{s.catalog?.length || 0} items</TableCell>
                <TableCell className="flex gap-2">
                  <Pencil
                    className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProvider(s);
                      setMode("edit");
                      setOpen(true);
                    }}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(s._id);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Menú contextual */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white rounded-xl shadow-lg border w-40"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            onClick={() => {
              setSelectedProvider(contextMenu.provider);
              setMode("view");
              setOpen(true);
              setContextMenu(null);
            }}
          >
            Ver
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            onClick={() => {
              setSelectedProvider(contextMenu.provider);
              setMode("edit");
              setOpen(true);
              setContextMenu(null);
            }}
          >
            Editar
          </div>
          <div
            className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer text-sm"
            onClick={() => handleDelete(contextMenu.provider._id)}
          >
            Eliminar
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedProvider(null);
        }}
        title={
          !selectedProvider
            ? "Agregar proveedor"
            : mode === "view"
              ? "Detalle de proveedor"
              : "Editar proveedor"
        }
        size="lg"
      >
        <ProviderForm
          onClose={() => {
            setOpen(false);
            setSelectedProvider(null);
          }}
          onSuccess={handleSuccess}
          provider={selectedProvider}
          mode={mode}
        />
      </Modal>
    </div>
  );
}