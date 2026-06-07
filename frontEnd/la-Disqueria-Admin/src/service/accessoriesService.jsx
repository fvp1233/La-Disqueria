const API_URL = "http://localhost:4000/api/accessories";

export const accessoriesService = {
  // Obtener todos los accesorios
  getAll: async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error al obtener los accesorios:", error);
      throw error;
    }
  },

  // Obtener un accesorio por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error al obtener el accesorio con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear accesorio
  create: async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error al crear el accesorio:", error);
      throw error;
    }
  },

  // Actualizar accesorio
  update: async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`Error al actualizar el accesorio con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar accesorio
  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error al eliminar el accesorio con ID ${id}:`, error);
      throw error;
    }
  },
};