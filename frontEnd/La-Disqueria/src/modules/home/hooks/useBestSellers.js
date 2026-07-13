import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/orders/bestsellers";
const MIN_ITEMS = 6;

// Combina el ranking real de ventas (colección orders) con el catálogo
// vigente. Si no hay suficientes productos con ventas (mínimo MIN_ITEMS),
// completa con los últimos productos agregados al catálogo.
const useBestSellers = (catalog = []) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("No se pudo obtener el ranking de más vendidos");

        const data = await response.json();
        setRanking(data);
      } catch (err) {
        setError(err.message || "Error al cargar los más vendidos");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const availableCatalog = catalog.filter((item) => item.isAvailable);

  const sold = ranking
    .map((entry) => availableCatalog.find((item) => item.id === entry.productId))
    .filter(Boolean);

  const soldIds = new Set(sold.map((item) => item.id));

  const missing = MIN_ITEMS - sold.length;
  const recent = missing > 0
    ? [...availableCatalog]
        .filter((item) => !soldIds.has(item.id))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, missing)
    : [];

  const bestSellers = [...sold, ...recent];

  return { bestSellers, loading, error };
};

export default useBestSellers;
