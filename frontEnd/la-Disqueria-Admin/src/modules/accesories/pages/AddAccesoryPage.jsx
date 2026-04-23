"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AgregarAccessory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    subtype: "",
    description: "",
    compatible_with: "",
    material: "",
    price: "",
    images: null,
    tags: "",
    isAvailable: true,
  });

  useEffect(() => {
    const editData = JSON.parse(localStorage.getItem("editAccessory"));

    if (editData) {
      const { item } = editData;

      setForm({
        name: item.name || "",
        brand: item.brand || "",
        subtype: item.subtype || "",
        description: item.description || "",
        compatible_with: item.compatible_with || "",
        material: item.material || "",
        price: item.price || "",
        images: item.images || null,
        tags: item.tags || "",
        isAvailable: item.isAvailable ?? true,
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, images: [reader.result] });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAccessory = {
      ...form,
      price: Number(form.price),
      tags: typeof form.tags === "string"
        ? form.tags.split(",").map(t => t.trim())
        : form.tags,
    };

    const items = JSON.parse(localStorage.getItem("accessories")) || [];
    const editData = JSON.parse(localStorage.getItem("editAccessory"));

    if (editData) {
      items[editData.index] = newAccessory;
      localStorage.removeItem("editAccessory");
    } else {
      items.push(newAccessory);
    }

    localStorage.setItem("accessories", JSON.stringify(items));

    navigate("/accessories");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[#334647] mb-6">
          {JSON.parse(localStorage.getItem("editAccessory"))
            ? "Editar Accesorio"
            : "Agregar Accesorio"}
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

          <input type="file" onChange={handleImageChange} />

          <div className="grid grid-cols-2 gap-4">
            <input name="name" value={form.name} placeholder="Nombre" onChange={handleChange} className="input" />
            <input name="brand" value={form.brand} placeholder="Marca" onChange={handleChange} className="input" />
            <input name="subtype" value={form.subtype} placeholder="Tipo" onChange={handleChange} className="input" />
            <input name="price" value={form.price} placeholder="Precio" type="number" onChange={handleChange} className="input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="material" value={form.material} placeholder="Material" onChange={handleChange} className="input" />
            <input name="compatible_with" value={form.compatible_with} placeholder="Compatible con" onChange={handleChange} className="input" />
            <input name="tags" value={form.tags} placeholder="Tags (coma separadas)" onChange={handleChange} className="input col-span-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="description" value={form.description} placeholder="Descripción" onChange={handleChange} className="input col-span-2" />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
              />
              Disponible
            </label>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                localStorage.removeItem("editAccessory");
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