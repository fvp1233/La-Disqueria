import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/turntables";

const useDataTurntables = () => {
  const [dataTurntables, setDataTurntables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchDataTurntables = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener los tocadiscos");
      const data = await response.json();
      setDataTurntables(data);
    } catch (err) {
      setError(err.message || "Error al cargar los tocadiscos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTurntables();
  }, []);

  const saveTurntable = async (id, formData) => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) throw new Error(id ? "No se pudo actualizar el tocadisco" : "No se pudo registrar el tocadisco");

      setMessage(id ? "Tocadisco actualizado con éxito" : "Tocadisco registrado con éxito");
      await fetchDataTurntables();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el tocadisco");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este tocadisco?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el tocadisco");
      setMessage("Tocadisco eliminado correctamente");
      await fetchDataTurntables();
    } catch (err) {
      setError(err.message || "Error al eliminar el tocadisco");
    }
  };

  return {
    dataTurntables,
    loading,
    submitting,
    error,
    message,
    saveTurntable,
    handleDelete,
    fetchDataTurntables,
  };
};

export default useDataTurntables;