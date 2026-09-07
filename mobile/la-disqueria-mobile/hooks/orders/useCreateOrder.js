import { useState } from "react";
import apiClient from "../../lib/apiClient";

const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient("/orders", {
        method: "POST",
        body: orderData,
      });

      return response?.data || response;
    } catch (err) {
      const errorMsg = err.message || "Error al crear la orden";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error, setError };
};

export default useCreateOrder;
