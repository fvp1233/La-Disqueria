import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/suppliers";

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener los proveedores");
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message || "Error al cargar los proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const saveSupplier = async (id, data) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      setMessage(id ? "Proveedor actualizado con éxito" : "Proveedor creado con éxito");
      await fetchSuppliers();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el proveedor");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proveedor?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el proveedor");
      setMessage("Proveedor eliminado correctamente");
      await fetchSuppliers();
    } catch (err) {
      setError(err.message || "Error al eliminar el proveedor");
    }
  };

  return {
    suppliers,
    loading,
    error,
    message,
    submitting,
    saveSupplier,
    handleDelete,
    fetchSuppliers,
  };
};

export default useSuppliers;