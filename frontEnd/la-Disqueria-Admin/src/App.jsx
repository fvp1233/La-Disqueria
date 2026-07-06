import { Routes, Route } from "react-router-dom"

import MainLayout from "@/global/layout/MainLayout"
import { ProtectedRoute } from "@/global/components/ProtectedRoute"

import DashboardPage from "@/modules/dashboard/pages/DashboardPage"
import OrdersPage from "@/modules/orders/pages/OrdersPage"
import DiscsPage from "@/modules/discs/pages/DiscsPage"
import AccesoriesPage from "@/modules/accesories/pages/AccesoriesPage"
import InventoryPage from "@/modules/inventory/pages/InventoryPage"
import ProvidersPage from "./modules/providers/pages/ProvidersPage"
import EmployeesPage from "./modules/employees/pages/EmployeesPage"
import CustomersPage from "./modules/customers/pages/CustomersPage"
import LoginPage from "./modules/login/pages/LoginPage"
import ProfilePage from "./modules/profile/pages/ProfilePage"

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Rutas protegidas: sin sesión iniciada redirigen a /login */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <MainLayout>
              <OrdersPage />
            </MainLayout>
          }
        />

        <Route
          path="/discs"
          element={
            <MainLayout>
              <DiscsPage />
            </MainLayout>
          }
        />

        <Route
          path="/accesories"
          element={
            <MainLayout>
              <AccesoriesPage />
            </MainLayout>
          }
        />

        <Route
          path="/inventory"
          element={
            <MainLayout>
              <InventoryPage />
            </MainLayout>
          }
        />

        <Route
          path="/providers"
          element={
            <MainLayout>
              <ProvidersPage />
            </MainLayout>
          }
        />

        <Route
          path="/employees"
          element={
            <MainLayout>
              <EmployeesPage />
            </MainLayout>
          }
        />

        <Route
          path="/customers"
          element={
            <MainLayout>
              <CustomersPage />
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />

      </Route>
    </Routes>
  );
}

export default App;