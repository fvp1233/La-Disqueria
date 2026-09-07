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
        q: query.trim(),
        ...filters,
      };

      const data = await apiClient("/products", {
        params,
      });

      let products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data?.data && Array.isArray(data.data)) {
        products = data.data;
      } else if (data?.products && Array.isArray(data.products)) {
        products = data.products;
      }

      setResults(products);
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
