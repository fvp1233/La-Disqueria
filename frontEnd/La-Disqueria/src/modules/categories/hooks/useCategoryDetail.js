import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:4000/api/categories";

const useCategoryDetail = (slug) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${BASE_URL}/slug/${slug}`);
        if (!response.ok) throw new Error("Categoría no encontrada");
        const data = await response.json();
        setCategory(data);
      } catch (err) {
        setError(err.message || "Error al cargar la categoría");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { category, loading, error, notFound: !loading && !error && !category };
};

export default useCategoryDetail;
