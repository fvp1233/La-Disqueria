import { useState } from 'react'
import './App.css'
import { Button } from '@/global/components/button'
import { Routes, Route } from "react-router-dom";
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
    </div>
    </>
  )
 
}

export default App
