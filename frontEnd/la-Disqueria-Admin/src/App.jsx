import { Routes, Route } from "react-router-dom"

import MainLayout from "@/global/layout/MainLayout"

import DashboardPage from "@/modules/dashboard/pages/DashboardPage"
import OrdersPage from "@/modules/orders/pages/OrdersPage"
import DiscsPage from "@/modules/discs/pages/DiscsPage"

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/discs" element={<DiscsPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App