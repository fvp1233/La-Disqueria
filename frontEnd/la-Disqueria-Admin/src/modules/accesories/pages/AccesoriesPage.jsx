"use client";

//Importamos React y hooks
import React, { useState } from "react";

import Card from "@/global/components/Card";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { Button } from "@/global/components/button";
import { Modal } from "@/global/components/Modal";
import { MultiFilterDropdown } from "@/global/components/MultiFilterDropdown";
import { AccessoryForm } from "@/modules/accesories/components/AccessoryForm";
import { Pagination } from "@/global/components/Pagination";
import usePagination from "@/global/hooks/usePagination";

import { Plus, Pencil, Trash2 } from "lucide-react";

//componentes de tabla
import {
 Table,
 TableHeader,
 TableBody,
 TableHead,
 TableRow,
 TableCell,
} from "@/global/components/Table";

//Hook con el GET/POST/PUT/DELETE reales de accesorios
import useDataAccessories from "@/modules/accesories/hooks/useDataAccesories";

export default function AccessoriesPage() {
 //Estado para el texto de búsqueda
 const [search, setSearch] = useState("");

 //Guarda la fila actualmente expandida
 const [openRow, setOpenRow] = useState(null);

 //Estado del modal de agregar/editar
 const [open, setOpen] = useState(false);
 const [selectedAccessory, setSelectedAccessory] = useState(null);

 //Filtro activo (estado o tipo) y su valor seleccionado
 const [filterCategory, setFilterCategory] = useState(null);
 const [filterValue, setFilterValue] = useState("all");

 const {
   dataAccessories,
   loading,
   handleDelete,
   fetchDataAccessories,
 } = useDataAccessories();

 const handleSuccess = async () => {
   await fetchDataAccessories();
   setOpen(false);
   setSelectedAccessory(null);
 };

 //Datos completos
 const data = dataAccessories;

 const handleFilterChange = (category, value) => {
   setFilterCategory(category);
   setFilterValue(value);
   setPage(1);
 };

 const types = [...new Set(data.map((item) => item.subtype).filter(Boolean))];

 const filterGroups = [
   {
     key: "estado",
     label: "Estado",
     options: [
       { label: "Todos", value: "all" },
       { label: "Disponible", value: "Disponible" },
       { label: "No disponible", value: "No disponible" },
     ],
   },
   {
     key: "tipo",
     label: "Tipo",
     options: [
       { label: "Todos", value: "all" },
       ...types.map((t) => ({ label: t, value: t })),
     ],
   },
 ];

 //Filtrar accesorios según el filtro activo y la búsqueda
 const filtered = data
   .filter((item) => {
     if (!filterCategory || filterValue === "all") return true;
     if (filterCategory === "estado") {
       const estadoText = item.isAvailable ? "Disponible" : "No disponible";
       return estadoText === filterValue;
     }
     if (filterCategory === "tipo") return item.subtype === filterValue;
     return true;
   })
   .filter((item) =>
     item?.name?.toLowerCase().includes(search.toLowerCase())
   );

 const {
   paginatedData: paginated,
   page,
   setPage,
   pageSize,
   setPageSize,
   totalPages,
   totalItems,
 } = usePagination(filtered, 10);

 //Devuelve el estado visual de disponibilidad
 const getEstado = (isAvailable) => {
 return isAvailable
 ? { text: "Disponible", color: "bg-green-300 text-black" }
 : { text: "No disponible", color: "bg-red-400 text-white" };
 };

 if (loading) {
   return (
     <div className="flex justify-center items-center min-h-100">
       <p className="text-slate-500 font-medium animate-pulse">Cargando accesorios desde la API...</p>
     </div>
   );
 }

 return (
 <div>
 <div className="bg-white p-6 rounded-2xl shadow-md relative">

 {/*Etiqueta superior*/}
 <div className="absolute -top-4 left-6">
 <button className="px-4 py-1 rounded bg-[#4A6163] text-[#F9FAF4]">
 Accesorios
 </button>
 </div>

 <div className="mt-6">

 {/* Tarjetas de resumen */}
 <div className="flex gap-6 flex-wrap">

 <Card
 title="Total de accesorios"
 value={data.length}
 change="+5%"
 changeText="Que el mes pasado"
 color="#FFB6C1"
 />

 <Card
 title="Disponibles"
 value={data.filter((item) => item.isAvailable).length}
 color="#B8D4FF"
 />

 <Card
 title="Accesorios agotados"
 value={data.filter((item) => !item.isAvailable).length}
 color="#F28B8B"
 />
 </div>

 {/*Barra de busqueda y botones*/}
 <div className="mt-8 flex justify-between items-center">

 <div className="flex gap-4 items-center">

 {/*Campo de busqueda*/}
 <InputGroupInlineStart
 value={search}
 onChange={(e) => {
   setSearch(e.target.value);
   setPage(1);
 }}
 />

 {/*Filtro por estado o tipo*/}
 <MultiFilterDropdown
 filters={filterGroups}
 activeFilter={filterCategory}
 value={filterValue}
 onChange={handleFilterChange}
 />
 </div>

 {/*Boton para agregar un nuevo accesorio*/}
 <Button
 variant="cd"
 onClick={() => {
   setSelectedAccessory(null);
   setOpen(true);
 }}>
 <Plus className="w-4 h-4" />
 <p className="text-base">Agregar</p>
 </Button>
 </div>

 {/*Tabla de accesorios*/}
 <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">
 <Table>

 {/*Encabezados*/}
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

 {/*Recorrer accesorios filtrados*/}
 {paginated.map((item, i) => {

 //Estado visual del accesorio
 const estado = getEstado(item.isAvailable);

 //Verifica si la fila está expandida
 const isOpen = openRow === i;

 return (
 <React.Fragment key={item._id || i}>

 {/*Fila principal*/}
 <TableRow
 onClick={() =>
 setOpenRow(isOpen ? null : i)
 }
 className="cursor-pointer hover:bg-gray-50 transition"
 >

 {/*Imagen*/}
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

 {/*Información básica*/}
 <TableCell>{item.name}</TableCell>
 <TableCell>{item.brand}</TableCell>
 <TableCell>{item.subtype}</TableCell>
 <TableCell>${item.price}</TableCell>

 {/*Estado*/}
 <TableCell>
 <span
 className={`px-3 py-1 rounded-full text-xs ${estado.color}`}
 >
 {estado.text}
 </span>
 </TableCell>

 {/*Acciones*/}
 <TableCell className="flex gap-2">

 {/*Botón editar*/}
 <Pencil
 className="w-4 h-4 cursor-pointer text-gray-500"
 onClick={(e) => {
 e.stopPropagation();
 setSelectedAccessory(item);
 setOpen(true);
 }}
 />

 {/*Botón eliminar*/}
 <Trash2
 className="w-4 h-4 cursor-pointer text-red-400"
 onClick={(e) => {
 e.stopPropagation();
 handleDelete(item._id);
 }}
 />
 </TableCell>
 </TableRow>

 {/*Información extra desplegable*/}
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
 {item.compatibleWith?.join(", ") || "-"}
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
     setSelectedAccessory(null);
   }}
   title={!selectedAccessory ? "Agregar accesorio" : "Editar accesorio"}
   size="md"
 >
   <AccessoryForm
     onClose={() => {
       setOpen(false);
       setSelectedAccessory(null);
     }}
     onSuccess={handleSuccess}
     accessory={selectedAccessory}
     mode="edit"
   />
 </Modal>
 </div>
 );
}
