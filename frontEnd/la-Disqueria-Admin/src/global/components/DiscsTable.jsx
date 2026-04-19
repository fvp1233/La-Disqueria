import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table"

const cds = [
  {
    id: "#CD001",
    nombre: "Future Nostalgia",
    artista: "Dua Lipa",
    precio: "$15",
    stock: 25,
  },
  {
    id: "#CD002",
    nombre: "After Hours",
    artista: "The Weeknd",
    precio: "$18",
    stock: 5,
  },
  {
    id: "#CD003",
    nombre: "SOUR",
    artista: "Olivia Rodrigo",
    precio: "$14",
    stock: 0,
  },
]

export default function DiscosTable() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Artista</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cds.map((d, i) => (
            <TableRow key={i}>
              <TableCell>{d.id}</TableCell>
              <TableCell>{d.nombre}</TableCell>
              <TableCell>{d.artista}</TableCell>
              <TableCell>{d.precio}</TableCell>
              <TableCell>{d.stock}</TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    d.stock > 10
                      ? "bg-green-500"
                      : d.stock > 0
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {d.stock > 10
                    ? "Disponible"
                    : d.stock > 0
                    ? "Bajo"
                    : "Agotado"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}