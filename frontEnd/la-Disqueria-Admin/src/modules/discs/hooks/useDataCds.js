import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/cds";

const useDataCds = () => {
  const [dataCds, setDataCds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchDataCds = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener el catálogo de CDs");
      const data = await response.json();
      setDataCds(data);
    } catch (err) {
      setError(err.message || "Error al cargar los CDs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataCds();
  }, []);

  const saveCd = async (id, formData) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData, // FormData para imágenes
      });

      if (!response.ok) throw new Error(id ? "No se pudo actualizar el CD" : "No se pudo registrar el CD");

      setMessage(id ? "CD actualizado con éxito" : "CD registrado con éxito");
      await fetchDataCds();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el CD");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este CD?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el CD");
      setMessage("CD eliminado correctamente");
      await fetchDataCds();
    } catch (err) {
      setError(err.message || "Error al eliminar el CD");
    }
  };

  return {
    dataCds,
    loading,
    submitting,
    error,
    message,
    saveCd,
    handleDelete,
    fetchDataCds,
  };
};

export default useDataCds;