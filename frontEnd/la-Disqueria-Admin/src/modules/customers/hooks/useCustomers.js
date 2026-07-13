import { useState, useEffect } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/customers";

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener los clientes");
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const saveCustomer = async (id, data) => {
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

      notifySuccess(id ? "Cliente actualizado con éxito" : "Cliente creado con éxito");
      await fetchCustomers();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar el cliente");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Estás seguro de eliminar este cliente?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el cliente");
      notifySuccess("Cliente eliminado correctamente");
      await fetchCustomers();
    } catch (err) {
      notifyError(err.message || "Error al eliminar el cliente");
    }
  };

  return {
    customers,
    loading,
    submitting,
    saveCustomer,
    handleDelete,
    fetchCustomers,
  };
};

export default useCustomers;
