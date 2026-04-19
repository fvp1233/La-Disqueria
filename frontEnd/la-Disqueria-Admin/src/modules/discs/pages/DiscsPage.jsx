import { useState } from "react";
import Card from "@/global/components/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table";

export default function DiscosPage() {
  const [tipo, setTipo] = useState("cds");
  const [search, setSearch] = useState("");

  //datos
  const cdsData = [
    { album: "SOUR", artista: "Olivia Rodrigo", stock: 10, año: "2021", duracion: "nose", formato: "nose" },
    { album: "After Hours", artista: "The Weeknd", stock: 2, año: "2021", duracion: "nose", formato: "nose" },
    { album: "Future Nostalgia", artista: "Dua Lipa", stock: 0, año: "2021", duracion: "nose", formato: "nose"},
  ];

  const vinilosData = [
    { album: "AM", artista: "Arctic Monkeys", stock: 12, año: "2021", duracion: "nose", formato: "nose" },
    { album: "RAM", artista: "Daft Punk", stock: 3, año: "2021", duracion: "nose", formato: "nose"},
    { album: "Back to Black", artista: "Amy Winehouse", stock: 0, año: "2021", duracion: "nose", formato: "nose" },
  ];

  const data = tipo === "cds" ? cdsData : vinilosData;

  // FILTRO
  const filtered = data.filter((item) =>
    item.album.toLowerCase().includes(search.toLowerCase())
  );

  // ESTADO
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

          {/* CARDS (igual que ya tienes) */}
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

          {/* TABLA */}
          <div className="mt-8 bg-[#F5F5F2] p-4 rounded-2xl">

            {/* TOP BAR */}
            <div className="flex justify-between mb-4">
              <input
                placeholder="Buscar"
                className="px-4 py-2 rounded-full bg-[#F5F6F1] border border-[#D9D9D9] text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button className="px-5 py-2 bg-[#B3B3B3] rounded-full text-sm text-[#FFFFFF]">
                Agregar +
              </button>
            </div>

            <Table>
           <TableHeader>
  <TableRow>
    <TableHead>Album</TableHead>
    <TableHead>Artista</TableHead>
    <TableHead>Año</TableHead>
    <TableHead>Duración</TableHead>
    <TableHead>Formato</TableHead>
    <TableHead>Stock</TableHead>
    <TableHead>Estado</TableHead>
  </TableRow>
</TableHeader>

              <TableBody>
                {filtered.map((item, i) => {
                  const estado = getEstado(item.stock);

                  return (
                    <TableRow key={i}>
  <TableCell>{item.album}</TableCell>
  <TableCell>{item.artista}</TableCell>
  <TableCell>{item.año}</TableCell>
  <TableCell>{item.duracion}</TableCell>
  <TableCell>{item.formato}</TableCell>

  <TableCell>
    {item.stock}
    {item.stock <= 2 && item.stock !== 0}
    {item.stock === 0 }
  </TableCell>

  <TableCell>
    <span className={`px-3 py-1 rounded-full text-xs ${estado.color}`}>
      {estado.text}
    </span>
  </TableCell>
</TableRow>
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