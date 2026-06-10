import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/accessories";

const useDataAccessories = () => {
  const [dataAccessories, setDataAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchDataAccessories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener los accesorios");
      const data = await response.json();
      setDataAccessories(data);
    } catch (err) {
      setError(err.message || "Error al cargar los accesorios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAccessories();
  }, []);

  const saveAccessory = async (id, formData) => {
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

      if (!response.ok) throw new Error(id ? "No se pudo actualizar el accesorio" : "No se pudo registrar el accesorio");

      setMessage(id ? "Accesorio actualizado con éxito" : "Accesorio registrado con éxito");
      await fetchDataAccessories();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el accesorio");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este accesorio?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el accesorio");
      setMessage("Accesorio eliminado correctamente");
      await fetchDataAccessories();
    } catch (err) {
      setError(err.message || "Error al eliminar el accesorio");
    }
  };

  return {
    dataAccessories,
    loading,
    submitting,
    error,
    message,
    saveAccessory,
    handleDelete,
    fetchDataAccessories,
  };
};

export default useDataAccessories;