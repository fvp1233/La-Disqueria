import { useState, useEffect } from "react";
import apiClient from "../../lib/apiClient";

const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiClient("/genres");
        setGenres(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        setError(err.message || "Error al cargar géneros");
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading, error };
};

export default useGenres;
