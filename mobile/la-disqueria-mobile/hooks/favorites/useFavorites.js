import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient("/favorites");
        setFavorites(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || "Error al cargar favoritos");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const isFavorite = (productId) => favorites.some((fav) => fav.productId === productId);

  const addFavorite = async (productId) => {
    try {
      const response = await apiClient("/favorites", {
        method: "POST",
        body: { productId },
      });

      const newFavorite = response?.data || response;
      setFavorites((current) => [...current, newFavorite]);
      return true;
    } catch (err) {
      setError(err.message || "Error al agregar a favoritos");
      throw err;
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await apiClient(`/favorites/${productId}`, {
        method: "DELETE",
      });

      setFavorites((current) => current.filter((fav) => fav.productId !== productId));
      return true;
    } catch (err) {
      setError(err.message || "Error al remover de favoritos");
      throw err;
    }
  };

  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      return await removeFavorite(productId);
    } else {
      return await addFavorite(productId);
    }
  };

  return {
    favorites,
    loading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
};

export default useFavorites;
