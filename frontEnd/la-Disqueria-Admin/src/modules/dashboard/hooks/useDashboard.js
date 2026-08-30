import { useState, useEffect } from "react";
import { notifyError } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/dashboard";

const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, { credentials: "include" });
      if (!response.ok) throw new Error("No se pudo obtener el resumen del dashboard");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      notifyError(err.message || "Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, fetchStats };
};

export default useDashboard;
