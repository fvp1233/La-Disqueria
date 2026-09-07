import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useOrderById = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient(`/orders/${orderId}`);
        setOrder(data?.data || data);
      } catch (err) {
        setError(err.message || "Error al cargar la orden");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};

export default useOrderById;
