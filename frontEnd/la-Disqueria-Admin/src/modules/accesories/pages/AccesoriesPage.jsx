"use client";

//Importamos React y hooks
import React, { useState, useEffect } from "react";

//Hook de React Router para navegar entre páginas
import { useNavigate } from "react-router-dom";

import Card from "@/global/components/Card";
import { InputGroupInlineStart } from "@/global/components/SearchInput";
import { Button } from "@/global/components/button";

import { SlidersHorizontal, Plus, Pencil, Trash2 } from "lucide-react";

//componentes de tabla
import {
 Table,
 TableHeader,
 TableBody,
 TableHead,
 TableRow,
 TableCell,
} from "@/global/components/Table";

//Servicio para consumir la API de accesorios
import { accessoriesService } from "../../../service/accessoriesService.jsx";

export default function AccessoriesPage() {
 //Permite redireccionar a otras rutas
 const navigate = useNavigate();

 //Estado para el texto de búsqueda
 const [search, setSearch] = useState("");

 //Estado que almacena los accesorios obtenidos desde la API
 const [extraItems, setExtraItems] = useState([]);

 //Guarda la fila actualmente expandida
 const [openRow, setOpenRow] = useState(null);

 //Se ejecuta una sola vez al cargar la página
 useEffect(() => {
 loadAccessories();
 }, []);

 //Obtener todos los accesorios desde la API
 const loadAccessories = async () => {
 try {
 const data = await accessoriesService.getAll();
 setExtraItems(data);
 } catch (error) {
 console.error(error);
 }
 };

 //ELIMINAR ACCESORIO
 const handleDelete = async (id) => {
 try {
 //Elimina el accesorio en la base de datos
 await accessoriesService.delete(id);

 //Actualiza la lista local eliminando el elemento
 setExtraItems((prev) =>
 prev.filter((item) => item._id !== id)
 );
 } catch (error) {
 console.error(error);
 }
 };

 //EDITAR ACCESORIO
 const handleEdit = (item) => {
 //Navega a la pantalla de edición usando el ID
 navigate(`/accessories/edit/${item._id}`);
 };

 //Datos completos
 const data = extraItems;

 //Filtrar accesorios según la búsqueda
 const filtered = data.filter((item) =>
 item?.name?.toLowerCase().includes(search.toLowerCase())
 );

 //Devuelve el estado visual de disponibilidad
 const getEstado = (isAvailable) => {
 return isAvailable
 ? { text: "Disponible", color: "bg-green-300 text-black" }
 : { text: "No disponible", color: "bg-red-400 text-white" };
 };

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

 {/*Barra de busqueda y botones*/}
 <div className="mt-8 flex justify-between items-center">

 <div className="flex gap-4 items-center">

 {/*Campo de busqueda*/}
 <InputGroupInlineStart
 onChange={(e) => setSearch(e.target.value)}
 />

 {/*Botnn de filtro */}
 <Button variant="filter">
 <p className="text-base">Filtrar</p>
 <SlidersHorizontal className="w-4 h-4" />
 </Button>
 </div>

 {/*Boton para agregar un nuevo accesorio*/}
 <Button
 variant="cd"
 onClick={() => navigate("/accessories/add")}>
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
 {filtered.map((item, i) => {

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
 handleEdit(item);
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
 </div>
 </div>
 </div>
 </div>
 );
}