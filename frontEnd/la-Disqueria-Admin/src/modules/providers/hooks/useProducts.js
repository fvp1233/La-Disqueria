import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:4000/api";

const useProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const [vinyls, cds, turntables, accessories] = await Promise.all([
        fetch(`${BASE_URL}/vinyls`).then(r => r.json()),
        fetch(`${BASE_URL}/cds`).then(r => r.json()),
        fetch(`${BASE_URL}/turntables`).then(r => r.json()),
        fetch(`${BASE_URL}/accessories`).then(r => r.json()),
      ]);

      setAllProducts([
        ...vinyls.map(p => ({ ...p, type: "vinyl", displayName: p.tittle || p.title })),
        ...cds.map(p => ({ ...p, type: "cd", displayName: p.title })),
        ...turntables.map(p => ({ ...p, type: "turntable", displayName: `${p.brand} ${p.model}` })),
        ...accessories.map(p => ({ ...p, type: "accessory", displayName: p.name || p.title })),
      ]);
    } catch (err) {
      setError(err.message || "Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return { allProducts, loading, error };
};

export default useProducts;