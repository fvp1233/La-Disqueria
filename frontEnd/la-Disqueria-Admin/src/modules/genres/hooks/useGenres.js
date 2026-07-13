import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/genres";

const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener los géneros");
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

  const saveGenre = async (id, data) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      setMessage(id ? "Género actualizado con éxito" : "Género creado con éxito");
      await fetchGenres();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el género");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este género?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el género");
      setMessage("Género eliminado correctamente");
      await fetchGenres();
    } catch (err) {
      setError(err.message || "Error al eliminar el género");
    }
  };

  return {
    genres,
    loading,
    error,
    message,
    submitting,
    saveGenre,
    handleDelete,
    fetchGenres,
  };
};

export default useGenres;
