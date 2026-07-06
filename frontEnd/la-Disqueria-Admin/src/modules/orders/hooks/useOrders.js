import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/orders";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener las órdenes");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Error al cargar las órdenes");
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
      setError("");
      setMessage("");

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

      setMessage(id ? "Orden actualizada con éxito" : "Orden creada con éxito");
      await fetchOrders();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar la orden");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta orden?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar la orden");
      setMessage("Orden eliminada correctamente");
      await fetchOrders();
    } catch (err) {
      setError(err.message || "Error al eliminar la orden");
    }
  };

  return {
    orders,
    loading,
    error,
    message,
    submitting,
    saveOrder,
    handleDelete,
    fetchOrders,
  };
};

export default useOrders;
