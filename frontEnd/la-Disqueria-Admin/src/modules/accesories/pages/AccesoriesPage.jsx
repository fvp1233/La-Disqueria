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

import { accessoriesService } from "../../../service/accessoriesService.jsx";

export default function AccessoriesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [extraItems, setExtraItems] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    loadAccessories();
  }, []);

  const loadAccessories = async () => {
    try {
      const data = await accessoriesService.getAll();
      setExtraItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await accessoriesService.delete(id);

      setExtraItems((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  // EDIT
const handleEdit = (item) => {
  navigate(`/accessories/edit/${item._id}`);
};


  const data = extraItems;

  const filtered = data.filter((item) =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getEstado = (isAvailable) => {
    return isAvailable
      ? { text: "Disponible", color: "bg-green-300 text-black" }
      : { text: "No disponible", color: "bg-red-400 text-white" };
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-md relative">
        <div className="absolute -top-4 left-6">
          <button className="px-4 py-1 rounded bg-[#4A6163] text-[#F9FAF4]">
            Accesorios
          </button>
        </div>

        <div className="mt-6">
          <div className="flex gap-6 flex-wrap">
            <Card
              title="Total de accesorios"
              value={data.length}
              change="+5%"
              changeText="Que el mes pasado"
              color="#FFB6C1"
            />

            <Card
              title="Ingresos de accesorios"
              value="$70,540"
              change="+18%"
              changeText="Que el mes pasado"
              color="#B8D4FF"
            />

            <Card
              title="Con bajo stock"
              value="8"
              change="+33%"
              changeText="Que el mes pasado"
              color="#F3E2B3"
            />

            <Card
              title="Accesorios agotados"
              value="5"
              change="-29%"
              changeText="Que el mes pasado"
              color="#F28B8B"
            />
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <InputGroupInlineStart
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button variant="filter">
                <p className="text-base">Filtrar</p>
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="cd"
              onClick={() => navigate("/accessories/add")}
            >
              <Plus className="w-4 h-4" />
              <p className="text-base">Agregar</p>
            </Button>
          </div>

          <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((item, i) => {
                  const estado = getEstado(item.isAvailable);
                  const isOpen = openRow === i;

                  return (
                    <React.Fragment key={item._id || i}>
                      <TableRow
                        onClick={() =>
                          setOpenRow(isOpen ? null : i)
                        }
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <TableCell>
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                          )}
                        </TableCell>

                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.subtype}</TableCell>
                        <TableCell>${item.price}</TableCell>

                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${estado.color}`}
                          >
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
                              <div>
                                <b>Descripción:</b>{" "}
                                {item.description || "-"}
                              </div>

                              <div>
                                <b>Material:</b>{" "}
                                {item.material || "-"}
                              </div>

                              <div>
                                <b>Compatible con:</b>{" "}
                                {item.compatibleWith?.join(", ") ||
                                  "-"}
                              </div>

                              <div>
                                <b>Tags:</b>{" "}
                                {item.tags?.join(", ") || "-"}
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