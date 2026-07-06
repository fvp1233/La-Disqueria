import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api/employees";

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener los empleados");
      const result = await response.json();
      setEmployees(result.data || []);
    } catch (err) {
      setError(err.message || "Error al cargar los empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const saveEmployee = async (id, data) => {
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

      setMessage(id ? "Empleado actualizado con éxito" : "Empleado creado con éxito");
      await fetchEmployees();
      return true;
    } catch (err) {
      setError(err.message || "Error al guardar el empleado");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este empleado?")) return;
    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("No se pudo eliminar el empleado");
      setMessage("Empleado eliminado correctamente");
      await fetchEmployees();
    } catch (err) {
      setError(err.message || "Error al eliminar el empleado");
    }
  };

  return {
    employees,
    loading,
    error,
    message,
    submitting,
    saveEmployee,
    handleDelete,
    fetchEmployees,
  };
};

export default useEmployees;
