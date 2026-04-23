"use client";

import React from "react";
import StatCard from "@/global/components/cardDashboard";
import stats from "@/assets/stats.jpeg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/global/components/Table";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 bg-[#F3F4F1] min-h-screen font-sans">
      <h1 className="text-4xl text-[#334647] font-light mb-8">
        Buenos días, <span className="font-bold">director</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
        <div className="lg:col-span-4 flex flex-col gap-6">
          <StatCard 
            title="Ganancias totales" 
            value="$1,254,990" 
            change="+2%" 
            changeText="Cada mes" 
            color="#FFB06E" 
          />

          <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-100 flex-grow">
            <h2 className="text-xl font-medium text-gray-400 mb-4">Alertas de stock</h2>
            <Table>
              <TableBody>
                {[
                  { a: "Abbey Road", s: "3 discos", c: "bg-[#FF7D7D]" },
                  { a: "Aerosmith", s: "100 discos", c: "bg-[#B4F481]" },
                  { a: "Wonderwall", s: "1 discos", c: "bg-[#FF7D7D]" },
                  { a: "The Dark Side", s: "2 discos", c: "bg-[#FF7D7D]" },
                ].map((item, i) => (
                  <TableRow key={i} className="border-none">
                    <TableCell className="py-2 px-0 text-sm font-medium text-gray-700">{item.a}</TableCell>
                    <TableCell className="px-0 text-right">
                      <span className={`${item.c} text-white px-3 py-1 rounded-full text-[10px] font-bold`}>
                        {item.s}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium text-gray-400 mb-4">Ventas por día</h2>
            <div className="h-28 bg-red-50/30 rounded-2xl relative overflow-hidden">
               <div className="absolute bottom-0 w-full h-12 bg-red-200/40" style={{ clipPath: 'polygon(0 100%, 0 20%, 25% 60%, 45% 15%, 70% 85%, 100% 35%, 100% 100%)' }}></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[35px] p-4 shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
              <StatCard title="Ingresos" value="$990" change="+7%" changeText="mes ant." color="#FFB06E" />
              <StatCard title="Órdenes" value="500" change="+5%" changeText="mes ant." color="#D9D9D9" />
              <StatCard title="Clientes" value="274" change="+2%" changeText="mes ant." color="#D9D9D9" />
              <StatCard title="Top Venta" value="Abbey Road" change="200" changeText="vendidos" color="#D9D9D9" />
            </div>

            <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium text-gray-400 mb-4">Ventas</h2>
              <div className="h-full max-h-[200px] flex items-center justify-center">
                <img src={stats} alt="Gráfico" className="object-contain h-full w-full" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-100 flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-500">Órdenes Recientes</h2>
              <div className="flex gap-2">
                <input placeholder="Buscar" className="bg-[#F3F6F9] rounded-xl px-4 py-2 text-sm w-48 border-none outline-none" />
                <button className="bg-[#F3F6F9] px-3 py-2 rounded-xl text-gray-400">≡</button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-none bg-gray-50/50">
                  <TableHead className="rounded-l-xl">Cliente</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="rounded-r-xl">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { u: "Gabriela Castillo", p: "$89.54", s: "Entregado", c: "bg-[#B4F481]", d: "06 abril 2026" },
                  { u: "Fabiola Fuentes", p: "$104.99", s: "Pendiente", c: "bg-[#FFB06E]", d: "-" },
                  { u: "Isabel Portillo", p: "$48.99", s: "Entregado", c: "bg-[#B4F481]", d: "11 marzo 2026" },
                ].map((row, i) => (
                  <TableRow key={i} className="border-b border-gray-50 last:border-none">
                    <TableCell className="py-4 text-sm font-medium text-gray-700">{row.u}</TableCell>
                    <TableCell className="font-bold text-gray-600">{row.p}</TableCell>
                    <TableCell>
                      <span className={`${row.c} text-white px-3 py-1 rounded-xl text-xs font-bold`}>{row.s}</span>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">{row.d}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}