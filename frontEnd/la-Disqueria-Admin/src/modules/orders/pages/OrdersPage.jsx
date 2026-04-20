import Card from "@/global/components/Card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/global/components/Table"
import { StatusBadge } from "@/global/components/StatusBadge"

const ordenes = [
  {
    orderid: "#01542d415s",
    cliente: "Gabriela Isabel Castillo",
    precio: "$89.54",
    estado: "Entregado",
    descuento: "-10%",
    metodo_de_pago: "Nequi",
    fecha_de_entrega: "06 de abril del 2026",
  },
  {
    orderid: "#01542d415s",
    cliente: "Victoria Guadalupe Mena",
    precio: "$78.99",
    estado: "Entregado",
    descuento: "-",
    metodo_de_pago: "Tarjeta de Débito",
    fecha_de_entrega: "17 de marzo del 2026",
  },
  {
    orderid: "#01242e415s",
    cliente: "Isabel del Carmén Portillo",
    precio: "$48.99",
    estado: "Entregado",
    descuento: "-20%",
    metodo_de_pago: "Efectivo",
    fecha_de_entrega: "11 de marzo del 2026",
  },
  {
    orderid: "#01242e415s",
    cliente: "Fabiola Nicole Fuentes",
    precio: "$104.99",
    estado: "En camino",
    descuento: "-",
    metodo_de_pago: "Nequi",
    fecha_de_entrega: "-",
  },
  {
    orderid: "#01875f415g",
    cliente: "Monica Alejandra Giron",
    precio: "$64.99",
    estado: "En camino",
    descuento: "-",
    metodo_de_pago: "Efectivo",
    fecha_de_entrega: "-",
  },
];

export default function DiscosPage() {
  return (
    <div>

      {/* TARJETAS */}
      <div className="flex gap-6 flex-wrap">
        <Card
          title="Total de accesorios"
          value="150"
          change="+5%"
          changeText="Que el mes pasado"
          color="#EFA4B1"
        />

        <Card
          title="Ingresos de accesorios"
          value="$70,540"
          change="+18%"
          changeText="Que el mes pasado"
          color="#A9BDE5"
        />

        <Card
          title="Con bajo stock"
          value="8"
          change="+33%"
          changeText="Que el mes pasado"
          color="#E8D6A7"
        />

        <Card
          title="Accesorios agotados"
          value="5"
          change="-29%"
          changeText="Que el mes pasado"
          color="#E57373"
        />
      </div>

      {/* TABLA */}
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden Id</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Método de pago</TableHead>
              <TableHead>Fecha de entrega</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {ordenes.map((p, index) => (
              <TableRow key={index}>
                <TableCell>{p.orderid}</TableCell>
                <TableCell>{p.cliente}</TableCell>
                <TableCell>{p.precio}</TableCell>
                <TableCell><StatusBadge estado={p.estado} /></TableCell>
                <TableCell>{p.descuento}</TableCell>
                <TableCell>{p.metodo_de_pago}</TableCell>
                <TableCell>{p.fecha_de_entrega}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}