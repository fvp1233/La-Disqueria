import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient("/categories");
        setCategories(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || "Error al cargar categorías");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export default useCategories;
