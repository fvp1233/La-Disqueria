import { useState, useEffect } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/inventory";

const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener el inventario");
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar el inventario");
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

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      notifySuccess(id ? "Inventario actualizado con éxito" : "Inventario creado con éxito");
      await fetchInventory();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar el inventario");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Estás seguro de eliminar este item?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el item");
      notifySuccess("Item eliminado correctamente");
      await fetchInventory();
    } catch (err) {
      notifyError(err.message || "Error al eliminar el item");
    }
  };

  return {
    inventory,
    loading,
    submitting,
    saveInventory,
    handleDelete,
    fetchInventory,
  };
};

export default useInventory;