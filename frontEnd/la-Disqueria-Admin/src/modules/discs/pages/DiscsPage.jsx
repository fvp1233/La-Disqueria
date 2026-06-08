"use client";

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useDataVinyls from "@/modules/discs/hooks/useDataVinyls"; // Hook con el GET y DELETE reales

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

export default function DiscosPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { dataVinyls, loading, error, handleDelete } = useDataVinyls();

  const [tipo, setTipo] = useState(searchParams.get("tipo") || "vinilos"); // Cambiado a vinilos por defecto
  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState(null);

  const filtered = dataVinyls.filter((item) => {
    if (tipo === "cds") return false; 
    
    return item?.tittle?.toLowerCase().includes(search.toLowerCase());
  });

  const getEstado = (isAvailable) => {
    if (!isAvailable) return { text: "Agotado", color: "bg-red-400 text-white" };
    return { text: "Disponible", color: "bg-green-300 text-black" };
  };

  const totalVinilos = dataVinyls.length;
  const agotados = dataVinyls.filter(v => !v.isAvailable).length;
  const disponibles = totalVinilos - agotados;
  const valorInventario = dataVinyls.reduce((acc, curr) => acc + (curr.price || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <p className="text-slate-500 font-medium animate-pulse">Cargando catálogo desde la API...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-md relative">
        {/* Pestañas Superiores */}
        <div className="absolute -top-4 left-6 flex gap-2">
          <button onClick={() => setTipo("cds")} className={`px-4 py-1 rounded text-xs font-semibold ${tipo === "cds" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4] opacity-50"}`}>
            CDs
          </button>
          <button onClick={() => setTipo("vinilos")} className={`px-4 py-1 rounded text-xs font-semibold ${tipo === "vinilos" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4]"}`}>
            Vinilos
          </button>
        </div>

        <div className="mt-6">
          <div className="flex gap-6 flex-wrap">
            {tipo === "cds" ? (
              <>
                <Card title="Total de CDs" value="0" change="0%" changeText="Sin API" color="#EFA4B1" />
                <Card title="Ingresos de CDs" value="$0" change="0%" changeText="Sin API" color="#A9BDE5" />
                <Card title="Con bajo stock" value="0" change="0%" changeText="Sin API" color="#E8D6A7" />
                <Card title="CDs agotados" value="0" change="0%" changeText="Sin API" color="#E57373" />
              </>
            ) : (
              <>
                <Card title="Total de Vinilos" value={totalVinilos} change="API" changeText="Activa" color="#EFA4B1" />
                <Card title="Valor Inventario" value={`$${valorInventario.toLocaleString()}`} change="Mongoose" changeText="Total" color="#A9BDE5" />
                <Card title="Disponibles" value={disponibles} change="En Tienda" changeText="Copias" color="#E8D6A7" />
                <Card title="Vinilos Agotados" value={agotados} change="Requieren" changeText="Atención" color="#E57373" />
              </>
            )}
          </div>

          {/* Barra de Búsqueda y Botón Agregar */}
          <div className="mt-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <InputGroupInlineStart 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar vinilo..."
              />
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

          {/* Tabla de Resultados */}
          <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Álbum</TableHead>
                  <TableHead>Sello</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400 italic">
                      No se encontraron vinilos registrados en el catálogo.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item, i) => {
                    const estado = getEstado(item.isAvailable);
                    const isOpen = openRow === i;

                    // Extraemos la primera imagen o la que sea portada (isCover)
                    const coverImage = item.images?.find(img => img.isCover)?.image || item.images?.[0]?.image;

                    // Formateamos la fecha ISO de Mongo para extraer solo el año
                    const releaseYear = item.year ? new Date(item.year).getFullYear() : "-";

                    return (
                      <React.Fragment key={item._id || i}>
                        <TableRow
                          onClick={() => setOpenRow(isOpen ? null : i)}
                          className="cursor-pointer hover:bg-gray-50 transition"
                        >
                          <TableCell>
                            {coverImage ? (
                              <img src={coverImage} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="Cover" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">LP</div>
                            )}
                          </TableCell>

                          <TableCell className="font-semibold text-slate-700">{item.tittle}</TableCell>
                          <TableCell>{item.label || "-"}</TableCell>
                          <TableCell>{releaseYear}</TableCell>
                          <TableCell>{item.format || "-"}</TableCell>
                          <TableCell className="font-medium text-emerald-700">${item.price || "0.00"}</TableCell>

                          <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estado.color}`}>
                              {estado.text}
                            </span>
                          </TableCell>

                          <TableCell className="flex gap-3 pt-5">
                            <Pencil
                              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/discs/add?tipo=${tipo}&id=${item._id || item.id}`);
                              }}
                            />

                            <Trash2
                              className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600 transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item._id || item.id);
                              }}
                            />
                          </TableCell>
                        </TableRow>

                        {/* Fila Desplegable con los datos coleccionables y el Tracklist dinámico */}
                        {isOpen && (
                          <TableRow>
                            <TableCell colSpan={8}>
                              <div className="bg-white rounded-xl p-5 shadow-inner grid grid-cols-2 gap-4 text-sm border border-slate-100">
                                <div><b>Género:</b> {item.genre || "-"}</div>
                                <div><b>Velocidad:</b> {item.speed || "-"}</div>
                                <div><b>Tamaño:</b> {item.size || "-"}</div>
                                <div><b>Color:</b> {item.color || "-"}</div>
                                <div><b>Condición:</b> {item.condition || "-"}</div>
                                <div><b>Tags:</b> {item.tags || "-"}</div>
                                
                                {/* Render de canciones embebidas */}
                                <div className="col-span-2 border-t pt-3 mt-1">
                                  <span className="font-bold text-slate-700 block mb-2">Canciones en este disco:</span>
                                  {item.trackList && item.trackList.length > 0 ? (
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs">
                                      {item.trackList.map((track, tIdx) => (
                                        <li key={tIdx} className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                                          <span>
                                            <b className="text-slate-400 mr-1.5">{track.side}{track.position}.</b>
                                            {track.song_name}
                                          </span>
                                          <span className="text-slate-400 font-medium">{track.duration}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-slate-400 italic">No hay canciones cargadas en este álbum.</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}