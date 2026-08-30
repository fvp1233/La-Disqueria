"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import StatCard from "@/global/components/cardDashboard";
import { StatusBadge } from "@/global/components/StatusBadge";
import useDashboard from "@/modules/dashboard/hooks/useDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/global/components/Table";

const MONTH_NAMES_LONG = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const formatCurrency = (value) => `$${Math.round(value || 0).toLocaleString("en-US")}`;

const formatOrderPrice = (value) => `$${(value || 0).toFixed(2)}`;

const formatChange = (pct) => `${pct > 0 ? "+" : ""}${pct}%`;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${MONTH_NAMES_LONG[date.getMonth()]} ${date.getFullYear()}`;
};

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export default function DashboardPage() {
  const { stats, loading } = useDashboard();
  const [search, setSearch] = useState("");

  const recentOrders = stats?.recentOrders || [];

  const filteredOrders = useMemo(() => {
    if (!search) return recentOrders;
    const term = search.toLowerCase();
    return recentOrders.filter((order) =>
      order.customerName?.toLowerCase().includes(term)
    );
  }, [recentOrders, search]);

  if (loading || !stats) {
    return (
      <div className="w-screen -ml-[calc(50vw-50%)] p-4 md:p-8 bg-[#F3F4F1] min-h-screen font-sans">
        <p className="text-gray-500">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    // 🔥 BREAK OUT OF MAINLAYOUT WIDTH
    <div className="w-screen -ml-[calc(50vw-50%)] p-4 md:p-8 bg-[#F3F4F1] min-h-screen font-sans">

      <h1 className="text-4xl text-[#334647] font-light mb-8">
        Buenos días, <span className="font-bold">director</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <StatCard
            title="Ganancias totales"
            value={formatCurrency(stats.totalEarnings)}
            change={formatChange(stats.monthlyRevenueChangePct)}
            changeText="vs mes anterior"
            color="#FFB06E"
          />

          <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-100 flex-grow">
            <h2 className="text-xl font-medium text-gray-400 mb-4">
              Alertas de stock
            </h2>

            <Table>
              <TableBody>
                {stats.lowStock.length === 0 && (
                  <TableRow className="border-none">
                    <TableCell className="py-2 px-0 text-sm text-gray-400 text-left">
                      Sin alertas de inventario
                    </TableCell>
                  </TableRow>
                )}

                {stats.lowStock.map((item) => (
                  <TableRow key={item.id} className="border-none">
                    <TableCell className="py-2 px-0 text-sm font-medium text-gray-700 text-left">
                      {item.title}
                    </TableCell>

                    <TableCell className="px-0 text-right">
                      <span
                        className={`${item.stock <= 15 ? "bg-[#FF7D7D]" : "bg-[#B4F481]"
                          } text-white px-3 py-1 rounded-full text-[10px] font-bold`}
                      >
                        {item.stock} discos
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium text-gray-400 mb-4">
              Ventas por día
            </h2>

            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.salesByDay} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesByDayGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7D7D" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#FF7D7D" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#FF7D7D"
                    strokeWidth={2}
                    fill="url(#salesByDayGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[35px] p-4 shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
              <StatCard
                title="Ingresos"
                value={formatCurrency(stats.monthlyRevenue)}
                change={formatChange(stats.monthlyRevenueChangePct)}
                changeText="mes ant."
                color="#FFB06E"
              />
              <StatCard
                title="Órdenes"
                value={stats.ordersThisMonth}
                change={formatChange(stats.ordersChangePct)}
                changeText="mes ant."
                color="#D9D9D9"
              />
              <StatCard
                title="Clientes"
                value={stats.customersTotal}
                change={formatChange(stats.customersChangePct)}
                changeText="mes ant."
                color="#D9D9D9"
              />
              <StatCard
                title="Top Venta"
                value={stats.topSeller?.title || "Sin ventas"}
                change={stats.topSeller ? String(stats.topSeller.totalSold) : "-"}
                changeText="vendidos"
                color="#D9D9D9"
              />
            </div>

            <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-medium text-gray-400 mb-4">
                Ventas
              </h2>

              <div className="h-full max-h-[200px]">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats.salesByMonth} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#F3F4F1" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: "#F3F4F1" }} />
                    <Bar dataKey="total" fill="#FFB06E" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-100 flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-500">
                Órdenes Recientes
              </h2>

              <div className="flex gap-2">
                <input
                  placeholder="Buscar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#F3F6F9] rounded-xl px-4 py-2 text-sm w-48 border-none outline-none"
                />
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
                {filteredOrders.length === 0 && (
                  <TableRow className="border-none">
                    <TableCell colSpan={4} className="py-6 text-sm text-gray-400">
                      No hay órdenes que coincidan con la búsqueda
                    </TableCell>
                  </TableRow>
                )}

                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-b border-gray-50 last:border-none">
                    <TableCell className="py-4 text-sm font-medium text-gray-700">
                      {order.customerName}
                    </TableCell>

                    <TableCell className="font-bold text-gray-600">
                      {formatOrderPrice(order.total)}
                    </TableCell>

                    <TableCell>
                      <StatusBadge estado={capitalize(order.status)} />
                    </TableCell>

                    <TableCell className="text-gray-400 text-sm">
                      {formatDate(order.date)}
                    </TableCell>
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
