import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/categories";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudieron obtener las categorías");

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, fetchCategories };
};

export default useCategories;
