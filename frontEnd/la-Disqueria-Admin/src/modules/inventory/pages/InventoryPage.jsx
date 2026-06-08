import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { inventoryService } from "@/service/inventoryService";

import Card from "@/global/components/Card";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { SlidersHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/global/components/button";

import {
  Table, TableHeader, TableBody,
  TableHead, TableRow, TableCell,
} from "@/global/components/Table";

export default function InventoryPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await inventoryService.getAll();
        setInventory(data);
      } catch (err) {
        setError("Error al cargar el inventario");
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await inventoryService.delete(id);
      setInventory(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      alert("Error al eliminar el item");
    }
  };

  const handleEdit = (item) => {
    localStorage.setItem("editInventory", JSON.stringify(item));
    navigate("/inventory/add");
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
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="mt-6">

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
                localStorage.removeItem("editInventory");
                navigate("/inventory/add");
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
                            className="w-4 h-4 cursor-pointer text-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          />
                          <Trash2
                            className="w-4 h-4 cursor-pointer text-red-400"
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
    </div>
  );
}