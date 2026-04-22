"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@/global/components/Card";
import { InputGroupInlineStart } from "@/global/components/SearchInput"
import { SlidersHorizontal, Plus, Pencil, Trash2 } from "lucide-react"
import { useSearchParams } from "react-router-dom";
import { Button } from "@/global/components/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table";

export default function DiscosPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
const [tipo, setTipo] = useState(searchParams.get("tipo") || "cds");
  const [search, setSearch] = useState("");
  const [extraDiscs, setExtraDiscs] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("discos")) || [];
    setExtraDiscs(guardados);
  }, []);

  // 🔥 DELETE (FIXED INDEX)
  const handleDelete = (index, isExtra) => {
    if (!isExtra) return; // don't delete base data

    const updated = [...extraDiscs];
    updated.splice(index, 1);

    setExtraDiscs(updated);
    localStorage.setItem("discos", JSON.stringify(updated));
  };

  // 🔥 EDIT
  const handleEdit = (index, isExtra) => {
    if (!isExtra) return;

    const disc = extraDiscs[index];

    localStorage.setItem(
      "editDisc",
      JSON.stringify({ disc, index })
    );

    navigate(`/discs/add?tipo=${disc.tipo}`);
  };

  //datos base
  const cdsData = [
    { album: "SOUR", artista: "Olivia Rodrigo", stock: 10, año: "2021", duracion: "nose", formato: "nose" },
    { album: "After Hours", artista: "The Weeknd", stock: 2, año: "2021", duracion: "nose", formato: "nose" },
    { album: "Future Nostalgia", artista: "Dua Lipa", stock: 0, año: "2021", duracion: "nose", formato: "nose" },
  ];

  const vinilosData = [
    { album: "AM", artista: "Arctic Monkeys", stock: 12, año: "2021", duracion: "nose", formato: "nose" },
    { album: "RAM", artista: "Daft Punk", stock: 3, año: "2021", duracion: "nose", formato: "nose" },
    { album: "Back to Black", artista: "Amy Winehouse", stock: 0, año: "2021", duracion: "nose", formato: "nose" },
  ];

  const baseData = tipo === "cds" ? cdsData : vinilosData;
  const nuevosFiltrados = extraDiscs.filter(d => d.tipo === tipo);

  // 🔥 important: track origin
  const data = [
    ...baseData.map(d => ({ ...d, isExtra: false })),
    ...nuevosFiltrados.map((d, i) => ({ ...d, isExtra: true, extraIndex: i }))
  ];

  const filtered = data.filter((item) =>
    item.album.toLowerCase().includes(search.toLowerCase())
  );

  const getEstado = (stock) => {
    if (stock === 0) return { text: "Agotado", color: "bg-red-400 text-white" };
    if (stock <= 5) return { text: "Bajo", color: "bg-yellow-300 text-black" };
    return { text: "Disponible", color: "bg-green-300 text-black" };
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Discos</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md relative">

        {/* BOTONES */}
        <div className="absolute -top-4 left-6 flex gap-2">
          <button onClick={() => setTipo("cds")} className={`px-4 py-1 rounded ${tipo === "cds" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4]"}`}>
            CDs
          </button>
          <button onClick={() => setTipo("vinilos")} className={`px-4 py-1 rounded ${tipo === "vinilos" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4]"}`}>
            Vinilos
          </button>
        </div>

        <div className="mt-6">

          {/* CARDS */}
          <div className="flex gap-6 flex-wrap">
            {tipo === "cds" ? (
              <>
                <Card title="Total de CDs" value="950" change="+3%" changeText="Que el mes pasado" color="#EFA4B1" />
                <Card title="Ingresos de CDs" value="$33,399" change="+20%" changeText="Que el mes pasado" color="#A9BDE5" />
                <Card title="Con bajo stock" value="67" change="+19%" changeText="Que el mes pasado" color="#E8D6A7" />
                <Card title="CDs agotados" value="23" change="-21%" changeText="Que el mes pasado" color="#E57373" />
              </>
            ) : (
              <>
                <Card title="Total de Vinilos" value="320" change="+5%" changeText="Que el mes pasado" color="#EFA4B1" />
                <Card title="Ingresos de Vinilos" value="$12,000" change="+10%" changeText="Que el mes pasado" color="#A9BDE5" />
                <Card title="Con bajo stock" value="12" change="+8%" changeText="Que el mes pasado" color="#E8D6A7" />
                <Card title="Vinilos agotados" value="4" change="-10%" changeText="Que el mes pasado" color="#E57373" />
              </>
            )}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <InputGroupInlineStart />
              <Button variant="filter">
                <p className="text-base">Filtrar</p>
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="cd"
              onClick={() => navigate(`/discs/add?tipo=${tipo}`)}
            >
              <Plus className="w-4 h-4" />
              <p className="text-base">Agregar</p>
            </Button>
          </div>

          {/* TABLA */}
          <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Artista</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((item, i) => {
                  const estado = getEstado(item.stock);
                  const isOpen = openRow === i;

                  return (
                    <>
                      <TableRow
                        key={i}
                        onClick={() => setOpenRow(isOpen ? null : i)}
                        className="cursor-pointer hover:bg-gray-50 transition"
                      >
                        <TableCell>
                          {item.imagen ? (
                            <img src={item.imagen} className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                          )}
                        </TableCell>

                        <TableCell>{item.album}</TableCell>
                        <TableCell>{item.artista}</TableCell>
                        <TableCell>{item.año}</TableCell>
                        <TableCell>{item.formato}</TableCell>
                        <TableCell>{item.stock}</TableCell>

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
                              handleEdit(item.extraIndex, item.isExtra);
                            }}
                          />

                          <Trash2
                            className="w-4 h-4 cursor-pointer text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.extraIndex, item.isExtra);
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {isOpen && (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <div className="bg-white rounded-xl p-4 shadow-inner grid grid-cols-2 gap-4 text-sm">
                              <div><b>Precio:</b> {item.precio || "-"}</div>
                              <div><b>Género:</b> {item.genero || "-"}</div>
                              <div><b>Edición:</b> {item.edicion || "-"}</div>
                              <div><b>Sello:</b> {item.selloDisco || "-"}</div>
                              <div><b>Tags:</b> {item.tags || "-"}</div>
                              <div><b>Pista:</b> {item.pista || "-"}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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