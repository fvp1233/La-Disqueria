"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AgregarInventario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    product_id: "",
    product_type: "",
    sku: "",
    stock: 1,
    location: "",
    supplier_id: [{ supplier_id: "" }],
  });

  useEffect(() => {
    const editData = JSON.parse(localStorage.getItem("editInventory"));

    if (editData) {
      setForm(editData.item);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSupplierChange = (e) => {
    setForm({
      ...form,
      supplier_id: [{ supplier_id: e.target.value }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const editData = JSON.parse(localStorage.getItem("editInventory"));

    if (editData) {
      inventory[editData.index] = form;
      localStorage.removeItem("editInventory");
    } else {
      inventory.push(form);
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));

    navigate("/inventory");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[#334647] mb-6">
          {JSON.parse(localStorage.getItem("editInventory"))
            ? "Editar Inventario"
            : "Agregar Producto"}
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <input name="product_id" value={form.product_id} placeholder="Product ID" onChange={handleChange} className="input" />
            <input name="product_type" value={form.product_type} placeholder="Tipo de Producto" onChange={handleChange} className="input" />
            <input name="sku" value={form.sku} placeholder="SKU" onChange={handleChange} className="input" />
            <input name="stock" type="number" value={form.stock} placeholder="Stock" onChange={handleChange} className="input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="location" value={form.location} placeholder="Ubicación" onChange={handleChange} className="input" />
            <input placeholder="Supplier ID" onChange={handleSupplierChange} className="input" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                localStorage.removeItem("editInventory");
                navigate(-1);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-[#4A6163] text-white rounded-lg"
            >
              Guardar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}