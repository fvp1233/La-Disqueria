import { useState, useEffect } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/suppliers";

const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener los proveedores");
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar los proveedores");
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

      notifySuccess(id ? "Proveedor actualizado con éxito" : "Proveedor creado con éxito");
      await fetchSuppliers();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar el proveedor");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Estás seguro de eliminar este proveedor?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el proveedor");
      notifySuccess("Proveedor eliminado correctamente");
      await fetchSuppliers();
    } catch (err) {
      notifyError(err.message || "Error al eliminar el proveedor");
    }
  };

  return {
    suppliers,
    loading,
    submitting,
    saveSupplier,
    handleDelete,
    fetchSuppliers,
  };
};

export default useSuppliers;