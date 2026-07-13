import { useState } from "react";
import { notifySuccess, notifyError } from "@/global/lib/notifications";

const API_URL = "http://localhost:4000/api/admin";

const useProfile = () => {
  const [submitting, setSubmitting] = useState(false);

  const updateProfile = async (id, data) => {
    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Error HTTP: ${response.status}`);

      notifySuccess("Perfil actualizado con éxito");
      return result.data;
    } catch (err) {
      notifyError(err.message || "Error al actualizar el perfil");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return { updateProfile, submitting };
};

export default useProfile;
