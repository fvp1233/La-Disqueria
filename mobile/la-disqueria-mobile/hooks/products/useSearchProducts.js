import { useState } from "react";
import apiClient from "../../lib/apiClient";

const useSearchProducts = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query, filters = {}) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = {
        search: query,
        ...filters,
      };

      const data = await apiClient("/products/search", {
        params,
      });

      setResults(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || "Error en la búsqueda");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clear };
};

export default useSearchProducts;
