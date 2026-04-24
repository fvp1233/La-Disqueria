import { Routes, Route } from "react-router-dom"

import MainLayout from "@/global/layout/MainLayout"

import DashboardPage from "@/modules/dashboard/pages/DashboardPage"
import OrdersPage from "@/modules/orders/pages/OrdersPage"
import DiscsPage from "@/modules/discs/pages/DiscsPage"
import AddDiscPage from "@/modules/discs/pages/AddDiscPage";
import AccesoriesPage from "@/modules/accesories/pages/AccesoriesPage"
import AddAccesoryPage from "@/modules/accesories/pages/AddAccesoryPage";
import InventoryPage from "@/modules/inventory/pages/InventoryPage"
import AddInventoryPage from "@/modules/inventory/pages/AddInventoryPage";
import ProvidersPage from "./modules/providers/ProvidersPage"
import EmployeesPage from "./modules/employees/pages/EmployeesPage"
import CustomersPage from "./modules/customers/pages/CustomersPage"
import LoginPage from "./modules/login/pages/LoginPage"

function App() {
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />

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
        path="/discs/add"
        element={
          <MainLayout>
            <AddDiscPage />
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
        path="/accessories/add"
        element={
          <MainLayout>
            <AddAccesoryPage />
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
        path="/inventory/add"
        element={
          <MainLayout>
            <AddInventoryPage />
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

    </Routes>
  );
}

export default App;