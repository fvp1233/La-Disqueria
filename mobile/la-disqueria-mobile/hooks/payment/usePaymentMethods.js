import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const usePaymentMethods = (customerId) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      setMethods([]);
      return;
    }

    const fetchMethods = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient(`/customers/${customerId}/payment-methods`);
        setMethods(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || "Error al cargar métodos de pago");
        setMethods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, [customerId]);

  const addPaymentMethod = async (methodData) => {
    try {
      const response = await apiClient(`/customers/${customerId}/payment-methods`, {
        method: "POST",
        body: methodData,
      });

      const newMethod = response?.data || response;
      setMethods((current) => [...current, newMethod]);
      return newMethod;
    } catch (err) {
      setError(err.message || "Error al agregar método de pago");
      throw err;
    }
  };

  const deletePaymentMethod = async (methodId) => {
    try {
      await apiClient(`/customers/${customerId}/payment-methods/${methodId}`, {
        method: "DELETE",
      });

      setMethods((current) => current.filter((m) => m.id !== methodId));
    } catch (err) {
      setError(err.message || "Error al eliminar método de pago");
      throw err;
    }
  };

  return { methods, loading, error, addPaymentMethod, deletePaymentMethod };
};

export default usePaymentMethods;
