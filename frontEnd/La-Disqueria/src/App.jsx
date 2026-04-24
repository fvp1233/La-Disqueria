import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/global/components/MainLayout';
import Home from '@/modules/home/pages/Home';
import Products from '@/modules/products/pages/Products'
import Login from '@/modules/login/pages/Login'
import ProductDetailPage from './modules/home/pages/Product-detail';
import CatalogPage from './modules/home/pages/Catalog';
import { Contact } from './modules/home/pages/Contact';
import {About} from './modules/home/pages/About';
import Artists from '@/modules/artist/pages/ArtistsPage';
import Categories from "@/modules/categories/Page/CategoriesPage"
import Registro from "@/modules/login/pages/Register";
import ForgotPassword from "@/modules/login/pages/ForgotPassword";
import RockPage from "@/modules/artist/pages/RockPage";


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
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/categorias" element={<Categories />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
            <Route path="/categorias/Rock" element={<RockPage />} />
            {/*seguir agregando más rutas de otros módulos */}
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
