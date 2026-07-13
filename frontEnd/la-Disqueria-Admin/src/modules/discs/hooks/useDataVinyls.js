import { useEffect, useState } from "react";
import { notifySuccess, notifyError, confirmDelete } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/vinyls";

const useDataVinyls = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [dataVinyls, setDataVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchDataVinyls = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener el catálogo de vinilos");
      const data = await response.json();
      setDataVinyls(data);
    } catch (fetchError) {
      notifyError(fetchError.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataVinyls();
  }, []);

  const saveVinyl = async (id, formData) => {
    try {
      setSubmitting(true);

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        body: formData, // FormData para imágenes
      });

      if (!response.ok) {
        throw new Error(id ? "No se pudo actualizar el vinilo" : "No se pudo registrar el vinilo");
      }

      notifySuccess(id ? "Vinilo actualizado con éxito" : "Vinilo registrado con éxito");
      await fetchDataVinyls(); // Refrescar catálogo
      return true; // Para indicarle al componente que la operación fue exitosa
    } catch (submitError) {
      notifyError(submitError.message || "Error al guardar el registro");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    const confirmed = await confirmDelete({ text: "¿Seguro que deseas eliminar este vinilo del catálogo?" });
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${itemId}`, { method: "DELETE", credentials: "include" });

      if (!response.ok) throw new Error("No se pudo eliminar el vinilo");

      notifySuccess("Vinilo eliminado correctamente");
      await fetchDataVinyls();
    } catch (deleteError) {
      notifyError(deleteError.message || "Error al eliminar el vinilo");
    }
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    submitting,
    dataVinyls,
    saveVinyl,
    handleDelete,
    fetchDataVinyls,
  };
};

export default useDataVinyls;