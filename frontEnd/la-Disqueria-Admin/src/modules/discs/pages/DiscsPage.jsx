"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useDataVinyls from "@/modules/discs/hooks/useDataVinyls";
import useDataCds from "@/modules/discs/hooks/useDataCds";
import useDataTurntables from "@/modules/discs/hooks/useDataTurntables";
import useArtists from "@/modules/artists/hooks/useArtists";
import useGenres from "@/modules/genres/hooks/useGenres";

import Card from "@/global/components/Card";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/global/components/button";
import { Modal } from "@/global/components/Modal";
import { MultiFilterDropdown } from "@/global/components/MultiFilterDropdown";
import { DiscForm } from "@/modules/discs/components/DiscForm";
import { CdForm } from "@/modules/discs/components/CdForm";
import { TurntableForm } from "@/modules/discs/components/TurntableForm";
import { ArtistForm } from "@/modules/artists/components/ArtistForm";
import { GenreForm } from "@/modules/genres/components/GenreForm";
import { Pagination } from "@/global/components/Pagination";
import usePagination from "@/global/hooks/usePagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table";

export default function DiscosPage() {
  const [searchParams] = useSearchParams();

  const {
    dataVinyls,
    loading: loadingVinyls,
    error: errorVinyls,
    message: messageVinyls,
    handleDelete: handleDeleteVinyl,
    fetchDataVinyls,
  } = useDataVinyls();

  const {
    dataCds,
    loading: loadingCds,
    error: errorCds,
    message: messageCds,
    handleDelete: handleDeleteCd,
    fetchDataCds,
  } = useDataCds();

  const {
    dataTurntables,
    loading: loadingTurntables,
    error: errorTurntables,
    message: messageTurntables,
    handleDelete: handleDeleteTurntable,
    fetchDataTurntables,
  } = useDataTurntables();

  const {
    artists,
    loading: loadingArtists,
    error: errorArtists,
    message: messageArtists,
    handleDelete: handleDeleteArtist,
    fetchArtists,
  } = useArtists();

  const {
    genres,
    loading: loadingGenres,
    error: errorGenres,
    message: messageGenres,
    handleDelete: handleDeleteGenre,
    fetchGenres,
  } = useGenres();

  const [tipo, setTipo] = useState(searchParams.get("tipo") || "vinilos");
  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterValue, setFilterValue] = useState("all");

  const isCds = tipo === "cds";
  const isArtists = tipo === "artistas";
  const isGenres = tipo === "generos";
  const isTurntables = tipo === "tocadiscos";

  const items = isGenres ? genres : isArtists ? artists : isCds ? dataCds : isTurntables ? dataTurntables : dataVinyls;
  const loading = isGenres ? loadingGenres : isArtists ? loadingArtists : isCds ? loadingCds : isTurntables ? loadingTurntables : loadingVinyls;
  const error = isGenres ? errorGenres : isArtists ? errorArtists : isCds ? errorCds : isTurntables ? errorTurntables : errorVinyls;
  const message = isGenres ? messageGenres : isArtists ? messageArtists : isCds ? messageCds : isTurntables ? messageTurntables : messageVinyls;

  const handleSuccess = async () => {
    if (isGenres) await fetchGenres();
    else if (isArtists) await fetchArtists();
    else if (isCds) await fetchDataCds();
    else if (isTurntables) await fetchDataTurntables();
    else await fetchDataVinyls();
    setOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id) => {
    if (isGenres) handleDeleteGenre(id);
    else if (isArtists) handleDeleteArtist(id);
    else if (isCds) handleDeleteCd(id);
    else if (isTurntables) handleDeleteTurntable(id);
    else handleDeleteVinyl(id);
  };

  const handleFilterChange = (category, value) => {
    setFilterCategory(category);
    setFilterValue(value);
    setPage(1);
  };

  const formats = [...new Set(items.map((item) => item.format).filter(Boolean))];

  const filterGroups = [
    {
      key: "estado",
      label: "Estado",
      options: [
        { label: "Todos", value: "all" },
        { label: "Disponible", value: "Disponible" },
        { label: "Agotado", value: "Agotado" },
      ],
    },
    {
      key: "formato",
      label: "Formato",
      options: [
        { label: "Todos", value: "all" },
        ...formats.map((f) => ({ label: f, value: f })),
      ],
    },
  ];

  const getEstado = (item) => {
    const isAvailable = item.isAvailable !== undefined ? item.isAvailable : item.is_available;
    if (!isAvailable) return { text: "Agotado", color: "bg-red-400 text-white" };
    return { text: "Disponible", color: "bg-green-300 text-black" };
  };

  const getTitle = (item) => {
    if (isTurntables) return `${item.brand || ""} ${item.model || ""}`.trim() || "Sin título";
    return isCds ? item.title : (item.tittle || item.title || "Sin título");
  };

  const getYear = (item) => {
    if (!item.year) return "-";
    if (typeof item.year === 'string' && item.year.includes('T')) {
      return new Date(item.year).getFullYear();
    }
    return item.year;
  };

  const getCoverImage = (item) => {
    if (isCds || isTurntables) {
      return item.images?.[0]?.image;
    }
    return item.images?.find((img) => img.isCover)?.image || item.images?.[0]?.image;
  };

  const getGenre = (item) => {
    if (Array.isArray(item.genre)) {
      return item.genre.join(", ");
    }
    return item.genre || "-";
  };

  const getTracks = (item) => {
    return item.trackList?.length > 0 ? item.trackList : (item.tracklist || []);
  };

  const getArtistName = (item) => {
    if (item.artistId?.name) return item.artistId.name;
    if (item.artist_id) return item.artist_id;
    return "Artista no especificado";
  };

  const getPrice = (item) => {
    if (typeof item.price === 'number') {
      return item.price.toFixed(2);
    }
    return item.price || "0.00";
  };

  const filtered = items
    .filter((item) => {
      if (!filterCategory || filterValue === "all") return true;
      if (filterCategory === "estado") {
        const isAvailable = item.isAvailable !== undefined ? item.isAvailable : item.is_available;
        const estadoText = isAvailable ? "Disponible" : "Agotado";
        return estadoText === filterValue;
      }
      if (filterCategory === "formato") return item.format === filterValue;
      return true;
    })
    .filter((item) => {
      let name;
      if (isGenres || isArtists) {
        name = item.name;
      } else if (isCds) {
        name = item.title;
      } else if (isTurntables) {
        name = `${item.brand || ""} ${item.model || ""}`;
      } else {
        name = item.tittle || item.title;
      }
      return name?.toLowerCase().includes(search.toLowerCase());
    });

  const {
    paginatedData: paginated,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = usePagination(filtered, 10);

  // Estadísticas para los Cards
  const totalVinilos = dataVinyls.length;
  const agotadosVinilos = dataVinyls.filter((v) => {
    const isAvailable = v.isAvailable !== undefined ? v.isAvailable : v.is_available;
    return !isAvailable;
  }).length;
  const disponiblesVinilos = totalVinilos - agotadosVinilos;
  const valorInventarioVinilos = dataVinyls.reduce((acc, curr) => {
    const price = typeof curr.price === 'number' ? curr.price : parseFloat(curr.price) || 0;
    return acc + price;
  }, 0);

  const totalCds = dataCds.length;
  const agotadosCds = dataCds.filter((c) => !c.isAvailable).length;
  const disponiblesCds = totalCds - agotadosCds;
  const valorInventarioCds = dataCds.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const totalTurntables = dataTurntables.length;
  const agotadosTurntables = dataTurntables.filter((t) => !t.isAvailable).length;
  const disponiblesTurntables = totalTurntables - agotadosTurntables;
  const valorInventarioTurntables = dataTurntables.reduce((acc, curr) => acc + (curr.price || 0), 0);

  const totalArtistas = artists.length;
  const generosDistintos = new Set(artists.flatMap((a) => a.genre || [])).size;
  const origenesDistintos = new Set(artists.map((a) => a.origin).filter(Boolean)).size;

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
      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-md relative">
        {/* Pestañas Superiores */}
        <div className="absolute -top-4 left-6 flex gap-2">
          <button
            onClick={() => {
              setTipo("cds");
              setOpenRow(null);
              setSearch("");
              setFilterCategory(null);
              setFilterValue("all");
              setPage(1);
            }}
            className={`px-4 py-1 rounded text-xs font-semibold ${tipo === "cds" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4] opacity-50"}`}
          >
            CDs
          </button>
          <button
            onClick={() => {
              setTipo("vinilos");
              setOpenRow(null);
              setSearch("");
              setFilterCategory(null);
              setFilterValue("all");
              setPage(1);
            }}
            className={`px-4 py-1 rounded text-xs font-semibold ${tipo === "vinilos" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4] opacity-50"}`}
          >
            Vinilos
          </button>
          <button
            onClick={() => {
              setTipo("tocadiscos");
              setOpenRow(null);
              setSearch("");
              setFilterCategory(null);
              setFilterValue("all");
              setPage(1);
            }}
            className={`px-4 py-1 rounded text-xs font-semibold ${tipo === "tocadiscos" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4] opacity-50"}`}
          >
            Tocadiscos
          </button>
          <button
            onClick={() => {
              setTipo("artistas");
              setOpenRow(null);
              setSearch("");
              setFilterCategory(null);
              setFilterValue("all");
              setPage(1);
            }}
            className={`px-4 py-1 rounded text-xs font-semibold ${tipo === "artistas" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4] opacity-50"}`}
          >
            Artistas
          </button>
          <button
            onClick={() => {
              setTipo("generos");
              setOpenRow(null);
              setSearch("");
              setFilterCategory(null);
              setFilterValue("all");
              setPage(1);
            }}
            className={`px-4 py-1 rounded text-xs font-semibold ${tipo === "generos" ? "bg-[#4A6163] text-[#F9FAF4]" : "bg-[#334647] text-[#C4C4C4] opacity-50"}`}
          >
            Géneros
          </button>
        </div>

        <div className="mt-6">
          <div className="flex gap-6 flex-wrap">
            {isGenres ? (
              <>
                <Card title="Total de Géneros" value={genres.length} change="API" changeText="Activa" color="#EFA4B1" />
              </>
            ) : isArtists ? (
              <>
                <Card title="Total de Artistas" value={totalArtistas} change="API" changeText="Activa" color="#EFA4B1" />
                <Card title="Géneros distintos" value={generosDistintos} change="Catálogo" changeText="Total" color="#A9BDE5" />
                <Card title="Orígenes distintos" value={origenesDistintos} change="Catálogo" changeText="Total" color="#E8D6A7" />
              </>
            ) : isCds ? (
              <>
                <Card title="Total de CDs" value={totalCds} change="API" changeText="Activa" color="#EFA4B1" />
                <Card title="Valor Inventario" value={`$${valorInventarioCds.toLocaleString()}`} change="Mongoose" changeText="Total" color="#A9BDE5" />
                <Card title="Disponibles" value={disponiblesCds} change="En Tienda" changeText="Copias" color="#E8D6A7" />
                <Card title="CDs Agotados" value={agotadosCds} change="Requieren" changeText="Atención" color="#E57373" />
              </>
            ) : isTurntables ? (
              <>
                <Card title="Total de Tocadiscos" value={totalTurntables} change="API" changeText="Activa" color="#EFA4B1" />
                <Card title="Valor Inventario" value={`$${valorInventarioTurntables.toLocaleString()}`} change="Mongoose" changeText="Total" color="#A9BDE5" />
                <Card title="Disponibles" value={disponiblesTurntables} change="En Tienda" changeText="Unidades" color="#E8D6A7" />
                <Card title="Tocadiscos Agotados" value={agotadosTurntables} change="Requieren" changeText="Atención" color="#E57373" />
              </>
            ) : (
              <>
                <Card title="Total de Vinilos" value={totalVinilos} change="API" changeText="Activa" color="#EFA4B1" />
                <Card title="Valor Inventario" value={`$${valorInventarioVinilos.toLocaleString()}`} change="Mongoose" changeText="Total" color="#A9BDE5" />
                <Card title="Disponibles" value={disponiblesVinilos} change="En Tienda" changeText="Copias" color="#E8D6A7" />
                <Card title="Vinilos Agotados" value={agotadosVinilos} change="Requieren" changeText="Atención" color="#E57373" />
              </>
            )}
          </div>

          {/* Barra de Búsqueda y Botón Agregar */}
          <div className="mt-8 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <InputGroupInlineStart
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={isGenres ? "Buscar género..." : isArtists ? "Buscar artista..." : isCds ? "Buscar CD..." : isTurntables ? "Buscar tocadiscos..." : "Buscar vinilo..."}
              />
              {!isArtists && !isGenres && (
                <MultiFilterDropdown
                  filters={filterGroups}
                  activeFilter={filterCategory}
                  value={filterValue}
                  onChange={handleFilterChange}
                />
              )}
            </div>

            <Button
              variant="cd"
              onClick={() => {
                setSelectedItem(null);
                setOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <p className="text-base">Agregar</p>
            </Button>
          </div>

          {/* Tabla de Resultados */}
          <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">
            {isGenres ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre del género</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-slate-400 italic">
                        No se encontraron géneros registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((genre) => (
                      <TableRow key={genre._id} className="hover:bg-gray-50 transition">
                        <TableCell className="font-semibold text-slate-700">{genre.name}</TableCell>
                        <TableCell className="flex gap-3 pt-5">
                          <Pencil
                            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black transition"
                            onClick={() => {
                              setSelectedItem(genre);
                              setOpen(true);
                            }}
                          />
                          <Trash2
                            className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600 transition"
                            onClick={() => handleDeleteItem(genre._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : isArtists ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Géneros</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-400 italic">
                        No se encontraron artistas registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((artist) => (
                      <TableRow key={artist._id} className="hover:bg-gray-50 transition">
                        <TableCell>
                          {artist.image ? (
                            <img src={artist.image} className="w-12 h-12 object-cover rounded-full shadow-sm" alt={artist.name} />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                              {artist.name?.[0] || "?"}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">{artist.name}</TableCell>
                        <TableCell>{(artist.genre || []).join(", ") || "-"}</TableCell>
                        <TableCell>{artist.origin || "-"}</TableCell>
                        <TableCell className="flex gap-3 pt-5">
                          <Pencil
                            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black transition"
                            onClick={() => {
                              setSelectedItem(artist);
                              setOpen(true);
                            }}
                          />
                          <Trash2
                            className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600 transition"
                            onClick={() => handleDeleteItem(artist._id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : isTurntables ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foto</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Garantía</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-400 italic">
                        No se encontraron tocadiscos registrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item, i) => {
                      const estado = getEstado(item);
                      const isOpen = openRow === i;
                      const coverImage = getCoverImage(item);
                      const displayPrice = getPrice(item);
                      const specs = item.specs?.[0] || {};

                      return (
                        <React.Fragment key={item._id || i}>
                          <TableRow
                            onClick={() => setOpenRow(isOpen ? null : i)}
                            className="cursor-pointer hover:bg-gray-50 transition"
                          >
                            <TableCell>
                              {coverImage ? (
                                <img src={coverImage} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt={item.model} />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  TD
                                </div>
                              )}
                            </TableCell>

                            <TableCell className="font-semibold text-slate-700">{item.brand || "-"}</TableCell>
                            <TableCell>{item.model || "-"}</TableCell>
                            <TableCell>{item.type || "-"}</TableCell>
                            <TableCell className="font-medium text-emerald-700">${displayPrice}</TableCell>
                            <TableCell>{item.warranty || "-"}</TableCell>

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
                                  setSelectedItem(item);
                                  setOpen(true);
                                }}
                              />

                              <Trash2
                                className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item._id);
                                }}
                              />
                            </TableCell>
                          </TableRow>

                          {isOpen && (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <div className="bg-white rounded-xl p-5 shadow-inner grid grid-cols-2 gap-4 text-sm border border-slate-100">
                                  <div><b>Descripción:</b> {item.description || "-"}</div>
                                  <div><b>Tipo de tracción:</b> {specs.driveType || "-"}</div>
                                  <div><b>Velocidades:</b> {specs.speeds?.join(", ") || "-"}</div>
                                  <div><b>USB:</b> {specs.hasUsb ? "Sí" : "No"}</div>
                                  <div><b>Preamplificador:</b> {specs.hasPreamp || "-"}</div>
                                  <div><b>Salida:</b> {specs.output || "-"}</div>
                                  <div><b>Torque:</b> {specs.torque || "-"}</div>
                                  <div><b>Wow &amp; Flutter:</b> {specs.wow || "-"}</div>
                                  <div className="col-span-2"><b>Tags:</b> {item.tags?.join(", ") || "-"}</div>
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
            ) : (
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
                        {isCds
                          ? "No se encontraron CDs registrados en el catálogo."
                          : "No se encontraron vinilos registrados en el catálogo."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((item, i) => {
                      const estado = getEstado(item);
                      const isOpen = openRow === i;
                      const title = getTitle(item);
                      const coverImage = getCoverImage(item);
                      const releaseYear = getYear(item);
                      const displayPrice = getPrice(item);
                      const genreDisplay = getGenre(item);
                      const tracks = getTracks(item);
                      const artistName = getArtistName(item);

                      return (
                        <React.Fragment key={item._id || i}>
                          <TableRow
                            onClick={() => setOpenRow(isOpen ? null : i)}
                            className="cursor-pointer hover:bg-gray-50 transition"
                          >
                            <TableCell>
                              {coverImage ? (
                                <img src={coverImage} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt={title} />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">
                                  {isCds ? "CD" : "LP"}
                                </div>
                              )}
                            </TableCell>

                            <TableCell className="font-semibold text-slate-700">{title}</TableCell>
                            <TableCell>{item.label || "-"}</TableCell>
                            <TableCell>{releaseYear}</TableCell>
                            <TableCell>{item.format || "-"}</TableCell>
                            <TableCell className="font-medium text-emerald-700">${displayPrice}</TableCell>

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
                                  setSelectedItem(item);
                                  setOpen(true);
                                }}
                              />

                              <Trash2
                                className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600 transition"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item._id || item.id);
                                }}
                              />
                            </TableCell>
                          </TableRow>

                          {/* Fila Desplegable con los datos adicionales del álbum */}
                          {isOpen && (
                            <TableRow>
                              <TableCell colSpan={8}>
                                <div className="bg-white rounded-xl p-5 shadow-inner grid grid-cols-2 gap-4 text-sm border border-slate-100">
                                  {isCds ? (
                                    <>
                                      <div><b>Género:</b> {genreDisplay}</div>
                                      <div><b>Edición:</b> {item.edition || "-"}</div>
                                      <div><b>Duración del álbum:</b> {item.album_duration || "-"}</div>
                                      <div><b>Tags:</b> {item.tags?.join(", ") || item.tags || "-"}</div>

                                      <div className="col-span-2 border-t pt-3 mt-1">
                                        <span className="font-bold text-slate-700 block mb-2">Canciones en este disco:</span>
                                        {tracks.length > 0 ? (
                                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs">
                                            {tracks.map((track, tIdx) => (
                                              <li key={tIdx} className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                                                <span>
                                                  <b className="text-slate-400 mr-1.5">
                                                    {track.side}{track.position || track.position} 
                                                  </b>
                                                  {track.song_name || track.title || "Sin título"}
                                                </span>
                                                <span className="text-slate-400 font-medium">{track.duration}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-xs text-slate-400 italic">No hay canciones cargadas en este álbum.</p>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div><b>Artista:</b> {artistName}</div>
                                      <div><b>Género:</b> {genreDisplay}</div>
                                      <div><b>Velocidad:</b> {item.speed || "-"}</div>
                                      <div><b>Tamaño:</b> {item.size || "-"}</div>
                                      <div><b>Color:</b> {item.color || "-"}</div>
                                      <div><b>Condición:</b> {item.condition || "-"}</div>
                                      <div><b>Tags:</b> {item.tags || "-"}</div>

                                      <div className="col-span-2 border-t pt-3 mt-1">
                                        <span className="font-bold text-slate-700 block mb-2">Canciones en este disco:</span>
                                        {tracks.length > 0 ? (
                                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs">
                                            {tracks.map((track, tIdx) => (
                                              <li key={tIdx} className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                                                <span>
                                                  <b className="text-slate-400 mr-1.5">
                                                    {track.side}{track.position || track.position} 
                                                  </b>
                                                  {track.song_name || track.title || "Sin título"}
                                                </span>
                                                <span className="text-slate-400 font-medium">{track.duration}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="text-xs text-slate-400 italic">No hay canciones cargadas en este álbum.</p>
                                        )}
                                      </div>
                                    </>
                                  )}
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
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={(p) => {
                setPage(p);
                setOpenRow(null);
              }}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setOpenRow(null);
              }}
            />
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedItem(null);
        }}
        title={
          !selectedItem
            ? `Agregar ${isGenres ? "Género" : isArtists ? "Artista" : isCds ? "CD" : isTurntables ? "Tocadiscos" : "Disco"}`
            : `Editar ${isGenres ? "Género" : isArtists ? "Artista" : isCds ? "CD" : isTurntables ? "Tocadiscos" : "Disco"}`
        }
        size="lg"
      >
        {isGenres ? (
          <GenreForm
            onClose={() => {
              setOpen(false);
              setSelectedItem(null);
            }}
            onSuccess={handleSuccess}
            genre={selectedItem}
            mode="edit"
          />
        ) : isArtists ? (
          <ArtistForm
            onClose={() => {
              setOpen(false);
              setSelectedItem(null);
            }}
            onSuccess={handleSuccess}
            artist={selectedItem}
            mode="edit"
          />
        ) : isCds ? (
          <CdForm
            onClose={() => {
              setOpen(false);
              setSelectedItem(null);
            }}
            onSuccess={handleSuccess}
            cd={selectedItem}
            mode="edit"
          />
        ) : isTurntables ? (
          <TurntableForm
            onClose={() => {
              setOpen(false);
              setSelectedItem(null);
            }}
            onSuccess={handleSuccess}
            turntable={selectedItem}
            mode="edit"
          />
        ) : (
          <DiscForm
            onClose={() => {
              setOpen(false);
              setSelectedItem(null);
            }}
            onSuccess={handleSuccess}
            vinyl={selectedItem}
            mode="edit"
            tipo={tipo}
          />
        )}
      </Modal>
    </div>
  );
}