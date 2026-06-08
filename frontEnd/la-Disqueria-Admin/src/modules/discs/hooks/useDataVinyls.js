import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api/vinyls"; 

const useDataVinyls = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [dataVinyls, setDataVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchDataVinyls = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener el catálogo de vinilos");
      const data = await response.json();
      console.log(data)
      setDataVinyls(data);
    } catch (fetchError) {
      setError(fetchError.message || "Error al cargar los datos");
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
      setError("");
      setMessage("");

      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        year: formData.year ? new Date(formData.year) : null,
      };

      const url = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(id ? "No se pudo actualizar el vinilo" : "No se pudo registrar el vinilo");
      }

      setMessage(id ? "Vinilo actualizado con éxito" : "Vinilo registrado con éxito");
      await fetchDataVinyls(); // Refrescar catálogo
      return true; // Para indicarle al componente que la operación fue exitosa
    } catch (submitError) {
      setError(submitError.message || "Error al guardar el registro");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este vinilo del catálogo?")) return;

    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${itemId}`, { method: "DELETE" });

      if (!response.ok) throw new Error("No se pudo eliminar el vinilo");

      setMessage("Vinilo eliminado correctamente");
      await fetchDataVinyls();
    } catch (deleteError) {
      setError(deleteError.message || "Error al eliminar el vinilo");
    }
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    submitting,
    error,
    message,
    dataVinyls,
    saveVinyl,
    handleDelete,
  };
};

export default useDataVinyls;