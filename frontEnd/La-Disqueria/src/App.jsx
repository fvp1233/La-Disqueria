import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/global/components/MainLayout';
import Home from '@/modules/home/pages/Home';
import Products from '@/modules/products/pages/Products'
import Login from '@/modules/login/pages/Login'
import ProductDetailPage from './modules/home/pages/Product-detail';
import CatalogPage from './modules/home/pages/Catalog';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/*Sin Navbar */}
          <Route path="/login" element={<Login />} />

          {/* CON NAVBAR */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products" element={<CatalogPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            {/*seguir agregando más rutas de otros módulos */}
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
