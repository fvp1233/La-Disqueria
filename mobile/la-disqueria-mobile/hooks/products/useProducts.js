import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useProducts = (type = null) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let path = "/products";
        if (type) {
          path = `/${type.toLowerCase()}`;
        }

        const data = await apiClient(path);

        let products = [];
        if (Array.isArray(data)) {
          products = data;
        } else if (data?.data && Array.isArray(data.data)) {
          products = data.data;
        } else if (data?.products && Array.isArray(data.products)) {
          products = data.products;
        }

        setProducts(products);
      } catch (err) {
        setError(err.message || "Error al cargar productos");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type]);

  return { products, loading, error };
};

export default useProducts;
