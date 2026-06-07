"use client";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { accessoriesService } from "../../../service/accessoriesService.jsx";

export default function AgregarAccessory() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    subtype: "",
    description: "",
    compatibleWith: "",
    material: "",
    price: "",
    tags: "",
    isAvailable: true,
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      loadAccessory();
    }
  }, [id]);

  const loadAccessory = async () => {
    try {
      const data = await accessoriesService.getById(id);

      setForm({
        name: data.name || "",
        brand: data.brand || "",
        subtype: data.subtype || "",
        description: data.description || "",
        compatibleWith: data.compatibleWith?.join(", ") || "",
        material: data.material || "",
        price: data.price || "",
        tags: data.tags?.join(", ") || "",
        isAvailable: data.isAvailable ?? true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("subtype", form.subtype);
      formData.append("description", form.description);
      formData.append("material", form.material);
      formData.append("price", form.price);
      formData.append("isAvailable", form.isAvailable);

      formData.append(
        "compatibleWith",
        JSON.stringify(
          form.compatibleWith
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      formData.append(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );

      if (image) {
        formData.append("images", image);
      }

      if (id) {
        await accessoriesService.update(id, formData);
        alert("Accesorio actualizado");
      } else {
        await accessoriesService.create(formData);
        alert("Accesorio agregado");
      }

      navigate("/accessories");
    } catch (error) {
      console.error(error);
      alert("Error al guardar accesorio");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[#334647] mb-6">
          {id ? "Editar Accesorio" : "Agregar Accesorio"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-8 space-y-6"
        >
          <input
            type="file"
            onChange={handleImageChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              placeholder="Nombre"
              onChange={handleChange}
              className="input"
            />

            <input
              name="brand"
              value={form.brand}
              placeholder="Marca"
              onChange={handleChange}
              className="input"
            />

            <input
              name="subtype"
              value={form.subtype}
              placeholder="Tipo"
              onChange={handleChange}
              className="input"
            />

            <input
              name="price"
              value={form.price}
              placeholder="Precio"
              type="number"
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="material"
              value={form.material}
              placeholder="Material"
              onChange={handleChange}
              className="input"
            />

            <input
              name="compatibleWith"
              value={form.compatibleWith}
              placeholder="Compatible con (separado por comas)"
              onChange={handleChange}
              className="input"
            />

            <input
              name="tags"
              value={form.tags}
              placeholder="Tags (separadas por comas)"
              onChange={handleChange}
              className="input col-span-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="description"
              value={form.description}
              placeholder="Descripción"
              onChange={handleChange}
              className="input col-span-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={handleChange}
              />
              Disponible
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/accessories")}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#4A6163] text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}