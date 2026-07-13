import { useState, useEffect } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/genres";

const useGenres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener los géneros");
      const data = await response.json();
      setGenres(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar los géneros");
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

      notifySuccess(id ? "Género actualizado con éxito" : "Género creado con éxito");
      await fetchGenres();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar el género");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Estás seguro de eliminar este género?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el género");
      notifySuccess("Género eliminado correctamente");
      await fetchGenres();
    } catch (err) {
      notifyError(err.message || "Error al eliminar el género");
    }
  };

  return {
    genres,
    loading,
    submitting,
    saveGenre,
    handleDelete,
    fetchGenres,
  };
};

export default useGenres;
