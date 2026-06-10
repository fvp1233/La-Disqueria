import React, { useState } from "react";
import { Pencil, Trash2, Plus, SlidersHorizontal } from "lucide-react";

import Card from "@/global/components/Card";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { Button } from "@/global/components/button";
import { Modal } from "@/global/components/Modal";
import { InventoryForm } from "@/modules/inventory/components/InventoryForm";
import useInventory from "@/modules/inventory/hooks/useInventory";

import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from "@/global/components/Table";

export default function InventoryPage() {
  const {
    inventory,
    loading,
    error,
    message,
    handleDelete,
    fetchInventory,
  } = useInventory();

  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("edit");

  const handleSuccess = async () => {
    await fetchInventory();
    setOpen(false);
    setSelectedItem(null);
  };

  const getEstado = (stock) => {
    if (stock === 0) return { text: "Agotado", color: "bg-red-400 text-white" };
    if (stock <= 5) return { text: "Bajo", color: "bg-yellow-300 text-black" };
    return { text: "Disponible", color: "bg-green-300 text-black" };
  };

  const getTipoLabel = (tipo) => {
    if (tipo === "cd") return "CD";
    if (tipo === "vinyl") return "Vinilo";
    if (tipo === "turntable") return "Tocadiscos";
    if (tipo === "accessory") return "Accesorio";
    return tipo;
  };

  const filtered = inventory.filter(item =>
    item?.sku?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Cargando inventario...</p>;

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="mt-6">

          {/* Mensajes */}
          {error && <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</p>}
          {message && <p className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">{message}</p>}

          {/* Cards */}
          <div className="flex gap-6 flex-wrap">
            <Card
              title="Total Productos"
              value={inventory.length}
              change="+5%"
              changeText="Que el mes pasado"
              color="#EFA4B1"
            />
            <Card
              title="Stock Total"
              value={inventory.reduce((acc, i) => acc + i.stock, 0)}
              change="+12%"
              changeText="Que el mes pasado"
              color="#A9BDE5"
            />
            <Card
              title="Stock Bajo"
              value={inventory.filter(i => i.stock <= 5).length}
              change="+8%"
              changeText="Que el mes pasado"
              color="#E8D6A7"
            />
            <Card
              title="Sin Stock"
              value={inventory.filter(i => i.stock === 0).length}
              change="-3%"
              changeText="Que el mes pasado"
              color="#E57373"
            />
          </div>

          {/* Buscador y botón */}
          <div className="mt-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <InputGroupInlineStart
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="filter">
                <p className="text-base">Filtrar</p>
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="cd"
              onClick={() => {
                setSelectedItem(null);
                setMode("edit");
                setOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <p className="text-base">Agregar</p>
            </Button>
          </div>

          {/* Tabla */}
          <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((item, i) => {
                  const estado = getEstado(item.stock);
                  const isOpen = openRow === i;

                  return (
                    <React.Fragment key={item._id}>
                      <TableRow
                        onClick={() => setOpenRow(isOpen ? null : i)}
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <TableCell>{getTipoLabel(item.productType)}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          {item.supplierId?.map((s, idx) => (
                            <span key={idx} className="text-xs text-gray-500">
                              {s.supplierId?.companny || s.supplierId?.company || s.supplierId?.toString()}{" "}
                            </span>
                          ))}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs ${estado.color}`}>
                            {estado.text}
                          </span>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Pencil
                            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                              setMode("edit");
                              setOpen(true);
                            }}
                          />
                          <Trash2
                            className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item._id);
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <div className="bg-white rounded-xl p-4 shadow-inner grid grid-cols-2 gap-4 text-sm">
                              <div><b>Tipo:</b> {getTipoLabel(item.productType)}</div>
                              <div><b>SKU:</b> {item.sku}</div>
                              <div><b>Stock:</b> {item.stock}</div>
                              <div><b>Ubicación:</b> {item.location}</div>
                              <div>
                                <b>Proveedor:</b>{" "}
                                {item.supplierId?.map(s =>
                                  s.supplierId?.companny || s.supplierId?.company || s.supplierId?.toString()
                                ).join(", ")}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>

        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? "Editar Inventario" : "Agregar Producto"}
        size="lg"
      >
        <InventoryForm
          onClose={() => {
            setOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={handleSuccess}
          item={selectedItem}
        />
      </Modal>
    </div>
  );
}