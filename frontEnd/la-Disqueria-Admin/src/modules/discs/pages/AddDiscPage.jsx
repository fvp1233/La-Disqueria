"use client";

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AgregarDisco() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get("tipo") || "cds";

  const [form, setForm] = useState({
    titulo: "",
    artista: "",
    formato: "",
    numeroPista: "",
    precio: "",
    duracion: "",
    selloDisco: "",
    ano: "",
    edicion: "",
    genero: "",
    tags: "",
    pista: "",
    stock: 1,
    imagen: null,
    estado: "Disponible",
  });

  // ✅ LOAD EDIT DATA
  useEffect(() => {
    const editData = JSON.parse(localStorage.getItem("editDisc"));

    if (editData) {
      const { disc } = editData;

      setForm({
        titulo: disc.album || "",
        artista: disc.artista || "",
        formato: disc.formato || "",
        numeroPista: disc.numeroPista || "",
        precio: disc.precio || "",
        duracion: disc.duracion || "",
        selloDisco: disc.selloDisco || "",
        ano: disc.año || "",
        edicion: disc.edicion || "",
        genero: disc.genero || "",
        tags: disc.tags || "",
        pista: disc.pista || "",
        stock: disc.stock || 1,
        imagen: disc.imagen || null,
        estado: disc.estado || "Disponible",
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
      setForm({ ...form, imagen: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // ✅ SAVE (CREATE OR UPDATE)
  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoDisco = {
      ...form,
      album: form.titulo,
      año: form.ano,
      tipo,
      stock: Number(form.stock), // 🔥 FIX (important)
    };

    const discos = JSON.parse(localStorage.getItem("discos")) || [];
    const editData = JSON.parse(localStorage.getItem("editDisc"));

    if (editData) {
      discos[editData.index] = nuevoDisco;
      localStorage.removeItem("editDisc");
    } else {
      discos.push(nuevoDisco);
    }

    localStorage.setItem("discos", JSON.stringify(discos));

    // 🔥 FIX (keep tab)
    navigate(`/discs?tipo=${tipo}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-[#334647] mb-6">
          {JSON.parse(localStorage.getItem("editDisc"))
            ? "Editar Disco"
            : `Agregar ${tipo === "cds" ? "CD" : "Vinilo"}`}
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">

          {/* IMAGE */}
          <input type="file" onChange={handleImageChange} />

          {/* BASIC */}
          <div className="grid grid-cols-2 gap-4">
            <input name="titulo" value={form.titulo} placeholder="Título" onChange={handleChange} className="input" />
            <input name="artista" value={form.artista} placeholder="Artista" onChange={handleChange} className="input" />
            <input name="genero" value={form.genero} placeholder="Género" onChange={handleChange} className="input" />
            <input name="ano" value={form.ano} placeholder="Año" onChange={handleChange} className="input" />
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-2 gap-4">
            <input name="formato" value={form.formato} placeholder="Formato" onChange={handleChange} className="input" />
            <input name="duracion" value={form.duracion} placeholder="Duración" onChange={handleChange} className="input" />
            <input name="precio" value={form.precio} placeholder="Precio" onChange={handleChange} className="input" />
            <input name="edicion" value={form.edicion} placeholder="Edición" onChange={handleChange} className="input" />
          </div>

          {/* EXTRA */}
          <div className="grid grid-cols-2 gap-4">
            <input name="selloDisco" value={form.selloDisco} placeholder="Sello Discográfico" onChange={handleChange} className="input" />
            <input name="stock" value={form.stock} placeholder="Stock" type="number" onChange={handleChange} className="input" />
            <input name="tags" value={form.tags} placeholder="Tags" onChange={handleChange} className="input col-span-2" />
            <input name="pista" value={form.pista} placeholder="Pista" onChange={handleChange} className="input col-span-2" />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                localStorage.removeItem("editDisc");
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