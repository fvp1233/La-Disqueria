"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@/global/components/Card";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { SlidersHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/global/components/button";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table";

export default function InventarioPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("inventory"));

    if (guardados && guardados.length > 0) {
      setInventory(guardados);
      return;
    }

    const baseInventory = [
      {
        product_id: "disc_1",
        product_type: "cd",
        sku: "CD-OLIVIA-001",
        stock: 10,
        location: "A1",
        supplier_id: [{ supplier_id: "SUP-001" }],
      },
      {
        product_id: "disc_2",
        product_type: "cd",
        sku: "CD-WEEKND-002",
        stock: 2,
        location: "A2",
        supplier_id: [{ supplier_id: "SUP-002" }],
      },
      {
        product_id: "disc_3",
        product_type: "vinilo",
        sku: "VIN-AM-003",
        stock: 0,
        location: "B1",
        supplier_id: [{ supplier_id: "SUP-003" }],
      },
      {
        product_id: "acc_1",
        product_type: "accessory",
        sku: "ACC-AUX-001",
        stock: 15,
        location: "C1",
        supplier_id: [{ supplier_id: "SUP-004" }],
      },
      {
        product_id: "acc_2",
        product_type: "accessory",
        sku: "ACC-SLEEVE-002",
        stock: 0,
        location: "C2",
        supplier_id: [{ supplier_id: "SUP-005" }],
      },
      {
        product_id: "acc_3",
        product_type: "accessory",
        sku: "ACC-CLEAN-003",
        stock: 6,
        location: "C3",
        supplier_id: [{ supplier_id: "SUP-006" }],
      },
    ];

    setInventory(baseInventory);
    localStorage.setItem("inventory", JSON.stringify(baseInventory));
  }, []);

  const handleDelete = (index) => {
    const updated = [...inventory];
    updated.splice(index, 1);

    setInventory(updated);
    localStorage.setItem("inventory", JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    const item = inventory[index];

    localStorage.setItem(
      "editInventory",
      JSON.stringify({ item, index })
    );

    navigate(`/inventory/add`);
  };

 
  const getEstado = (stock) => {
    if (stock === 0) return { text: "Agotado", color: "bg-red-400 text-white" };
    if (stock <= 5) return { text: "Bajo", color: "bg-yellow-300 text-black" };
    return { text: "Disponible", color: "bg-green-300 text-black" };
  };

  const getTipoLabel = (tipo) => {
    if (tipo === "cd") return "CD";
    if (tipo === "vinilo") return "Vinilo";
    return "Accesorio";
  };

  const filtered = inventory.filter((item) =>
    item?.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-md relative">

        <div className="mt-6">
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
              onClick={() => navigate(`/inventory/add`)}
            >
              <Plus className="w-4 h-4" />
              <p className="text-base">Agregar</p>
            </Button>
          </div>

          <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
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
                    <React.Fragment key={i}>
                      <TableRow
                        onClick={() => setOpenRow(isOpen ? null : i)}
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <TableCell>{item.product_id}</TableCell>
                        <TableCell>{getTipoLabel(item.product_type)}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.location}</TableCell>

                        <TableCell>
                          {item.supplier_id?.map((s, idx) => (
                            <span key={idx}>{s.supplier_id} </span>
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
                              handleEdit(i);
                            }}
                          />

                          <Trash2
                            className="w-4 h-4 cursor-pointer text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(i);
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <div className="bg-white rounded-xl p-4 shadow-inner grid grid-cols-2 gap-4 text-sm">
                              <div><b>Product ID:</b> {item.product_id}</div>
                              <div><b>Tipo:</b> {getTipoLabel(item.product_type)}</div>
                              <div><b>SKU:</b> {item.sku}</div>
                              <div><b>Ubicación:</b> {item.location}</div>
                              <div><b>Stock:</b> {item.stock}</div>
                              <div>
                                <b>Proveedor:</b>{" "}
                                {item.supplier_id?.map(s => s.supplier_id).join(", ")}
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