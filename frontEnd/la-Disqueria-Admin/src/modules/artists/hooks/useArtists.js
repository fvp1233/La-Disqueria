import { useState, useEffect } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/artists";

const useArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener los artistas");
      const data = await response.json();
      setArtists(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar los artistas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const saveArtist = async (id, formData) => {
    try {
      setSubmitting(true);

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData, // FormData para la imagen
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      notifySuccess(id ? "Artista actualizado con éxito" : "Artista creado con éxito");
      await fetchArtists();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar el artista");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Estás seguro de eliminar este artista?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el artista");
      notifySuccess("Artista eliminado correctamente");
      await fetchArtists();
    } catch (err) {
      notifyError(err.message || "Error al eliminar el artista");
    }
  };

  return {
    artists,
    loading,
    submitting,
    saveArtist,
    handleDelete,
    fetchArtists,
  };
};

export default useArtists;
