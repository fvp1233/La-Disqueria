import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/inventory";

const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener el inventario");
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError(err.message || "Error al cargar el inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const saveInventory = async (id, data) => {
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

      setMessage(id ? "Inventario actualizado con éxito" : "Inventario creado con éxito");
      await fetchInventory();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el inventario");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este item?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el item");
      setMessage("Item eliminado correctamente");
      await fetchInventory();
    } catch (err) {
      setError(err.message || "Error al eliminar el item");
    }
  };

  return {
    inventory,
    loading,
    error,
    message,
    submitting,
    saveInventory,
    handleDelete,
    fetchInventory,
  };
};

export default useInventory;