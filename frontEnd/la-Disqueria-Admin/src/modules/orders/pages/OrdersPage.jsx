import Card from "@/global/components/Card"
import OrdersTable from "@/global/components/OrdersTable"

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
        <OrdersTable />
      </div>
    </div>
  )
}