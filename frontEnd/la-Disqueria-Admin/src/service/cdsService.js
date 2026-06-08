const API_URL = "http://localhost:4000/api/cds";

export const cdsService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error al obtener los CDs:", error);
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Error HTTP: ${response.status}`);
      return data;
    } catch (error) {
      console.error("Error al crear CD:", error);
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Error HTTP: ${response.status}`);
      return data;
    } catch (error) {
      console.error(`Error al actualizar CD ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error al eliminar CD ${id}:`, error);
      throw error;
    }
  },
};