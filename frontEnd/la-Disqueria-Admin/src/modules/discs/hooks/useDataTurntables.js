import { useEffect, useState } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/turntables";

const useDataTurntables = () => {
  const [dataTurntables, setDataTurntables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDataTurntables = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener los tocadiscos");
      const data = await response.json();
      setDataTurntables(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar los tocadiscos");
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

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error(id ? "No se pudo actualizar el tocadisco" : "No se pudo registrar el tocadisco");

      notifySuccess(id ? "Tocadisco actualizado con éxito" : "Tocadisco registrado con éxito");
      await fetchDataTurntables();
      return true;
    } catch (err) {
      notifyError(err.message || "Error al guardar el tocadisco");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete({ text: "¿Seguro que deseas eliminar este tocadisco?" });
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el tocadisco");
      notifySuccess("Tocadisco eliminado correctamente");
      await fetchDataTurntables();
    } catch (err) {
      notifyError(err.message || "Error al eliminar el tocadisco");
    }
  };

  return {
    dataTurntables,
    loading,
    submitting,
    saveTurntable,
    handleDelete,
    fetchDataTurntables,
  };
};

export default useDataTurntables;