import { useEffect, useState } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/accessories";

const useDataAccessories = () => {
  const [dataAccessories, setDataAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDataAccessories = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener los accesorios");
      const data = await response.json();
      setDataAccessories(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar los accesorios");
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

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error(id ? "No se pudo actualizar el accesorio" : "No se pudo registrar el accesorio");

      notifySuccess(id ? "Accesorio actualizado con éxito" : "Accesorio registrado con éxito");
      await fetchDataAccessories();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar el accesorio");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Seguro que deseas eliminar este accesorio?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el accesorio");
      notifySuccess("Accesorio eliminado correctamente");
      await fetchDataAccessories();
    } catch (err) {
      notifyError(err.message || "Error al eliminar el accesorio");
    }
  };

  return {
    dataAccessories,
    loading,
    submitting,
    saveAccessory,
    handleDelete,
    fetchDataAccessories,
  };
};

export default useDataAccessories;