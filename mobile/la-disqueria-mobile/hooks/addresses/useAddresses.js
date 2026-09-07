import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useAddresses = (customerId) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      setAddresses([]);
      return;
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient(`/customers/${customerId}/addresses`);
        setAddresses(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || "Error al cargar direcciones");
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [customerId]);

  const addAddress = async (addressData) => {
    try {
      const response = await apiClient(`/customers/${customerId}/addresses`, {
        method: "POST",
        body: addressData,
      });

      const newAddress = response?.data || response;
      setAddresses((current) => [...current, newAddress]);
      return newAddress;
    } catch (err) {
      setError(err.message || "Error al agregar dirección");
      throw err;
    }
  };

  const updateAddress = async (addressId, updateData) => {
    try {
      const response = await apiClient(`/customers/${customerId}/addresses/${addressId}`, {
        method: "PUT",
        body: updateData,
      });

      const updated = response?.data || response;
      setAddresses((current) =>
        current.map((a) => (a.id === addressId ? updated : a))
      );
      return updated;
    } catch (err) {
      setError(err.message || "Error al actualizar dirección");
      throw err;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await apiClient(`/customers/${customerId}/addresses/${addressId}`, {
        method: "DELETE",
      });

      setAddresses((current) => current.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err.message || "Error al eliminar dirección");
      throw err;
    }
  };

  return { addresses, loading, error, addAddress, updateAddress, deleteAddress };
};

export default useAddresses;
