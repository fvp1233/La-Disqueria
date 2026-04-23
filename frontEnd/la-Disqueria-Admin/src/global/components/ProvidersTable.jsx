import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table"

import logo from "../../assets/logo.png" // ajusta si es necesario

const proveedores = [
  {
    id: "#01542d41ss",
    imagen: logo,
    compania: "Sonidos del Pacífico",
    contacto: "Carlos Hernández",
    correo: "ventas@sonidospacifico.com",
    telefono: "+503 7123-4567",
    pais: "El Salvador",
    ciudad: "San Salvador",
  },
  {
    id: "#01542d41ss",
    imagen: logo,
    compania: "Groove Supply Co.",
    contacto: "Andrea Martínez",
    correo: "contacto@groovesupply.co",
    telefono: "+503 7234-5678",
    pais: "El Salvador",
    ciudad: "Santa Tecla",
  },
]

export default function ProveedoresTable() {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-md p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Id</TableHead>
            <TableHead>Compañía</TableHead>
            <TableHead>Nombre de contacto</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Ciudad</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {proveedores.map((p, index) => (
            <TableRow key={index}>
              
              <TableCell>
                <img
                  src={p.imagen}
                  alt="logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </TableCell>

              <TableCell>{p.id}</TableCell>
              <TableCell>{p.compania}</TableCell>
              <TableCell>{p.contacto}</TableCell>
              <TableCell>{p.correo}</TableCell>
              <TableCell>{p.telefono}</TableCell>
              <TableCell>{p.pais}</TableCell>
              <TableCell>{p.ciudad}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}