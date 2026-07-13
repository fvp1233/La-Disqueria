import { useState, useEffect } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/orders";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener las órdenes");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Las órdenes creadas desde el admin usan el endpoint manual (/orders/manual),
  // ya que no dependen de un carrito de compras existente.
  const saveOrder = async (id, data) => {
    try {
      setSubmitting(true);

      const url = id ? `${API_URL}/${id}` : `${API_URL}/manual`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      notifySuccess(id ? "Orden actualizada con éxito" : "Orden creada con éxito");
      await fetchOrders();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar la orden");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Estás seguro de eliminar esta orden?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar la orden");
      notifySuccess("Orden eliminada correctamente");
      await fetchOrders();
    } catch (err) {
      notifyError(err.message || "Error al eliminar la orden");
    }
  };

  return {
    orders,
    loading,
    submitting,
    saveOrder,
    handleDelete,
    fetchOrders,
  };
};

export default useOrders;
