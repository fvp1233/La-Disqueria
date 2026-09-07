import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient("/orders");
        setOrders(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || "Error al cargar pedidos");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};

export default useOrders;
