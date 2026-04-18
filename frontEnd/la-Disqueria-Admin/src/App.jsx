import { useState } from 'react'
import './App.css'
import { Button } from '@/global/components/button'
import { Routes, Route } from "react-router-dom";
import Card from "@/global/components/Card"
import  Navbar from "@/global/components/NavBar";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div className="flex min-h-svh flex-col items-center justify-center">
        <Navbar/>
          <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/ordenes" element={<h1>Órdenes</h1>} />
        <Route path="/inventario" element={<h1>Inventario</h1>} />
        <Route path="/discos" element={<h1>Discos</h1>} />
      </Routes>
     
      <div className="flex gap-6 items-stretch flex-wrap">
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
    </div>
    </>
  )
 
}

export default App
