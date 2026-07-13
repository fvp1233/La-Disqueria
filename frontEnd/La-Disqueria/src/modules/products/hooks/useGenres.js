import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/genres";

const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudieron obtener los géneros");
      const data = await response.json();
      setGenres(data);
    } catch (err) {
      setError(err.message || "Error al cargar los géneros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return { genres, loading, error, fetchGenres };
};

export default useGenres;
