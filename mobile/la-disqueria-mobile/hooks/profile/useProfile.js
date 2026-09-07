import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useProfile = (customerId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customerId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient(`/customers/${customerId}`);
        setProfile(data?.data || data);
      } catch (err) {
        setError(err.message || "Error al cargar perfil");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [customerId]);

  const updateProfile = async (updateData) => {
    if (!customerId) return null;

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient(`/customers/${customerId}`, {
        method: "PUT",
        body: updateData,
      });

      const updated = response?.data || response;
      setProfile(updated);
      return updated;
    } catch (err) {
      const errorMsg = err.message || "Error al actualizar perfil";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile };
};

export default useProfile;
