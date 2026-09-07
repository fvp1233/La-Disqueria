import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useProductById = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient(`/products/${productId}`);
        setProduct(data?.data || data);
      } catch (err) {
        setError(err.message || "Error al cargar el producto");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

export default useProductById;
