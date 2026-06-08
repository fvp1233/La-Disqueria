const BASE_URL = "http://localhost:4000/api";

export const productsService = {
  getAll: async () => {
    try {
      const [vinyls, cds, turntables, accessories] = await Promise.all([
        fetch(`${BASE_URL}/vinyls`).then(r => r.json()),
        fetch(`${BASE_URL}/cds`).then(r => r.json()),
        fetch(`${BASE_URL}/turntables`).then(r => r.json()),
        fetch(`${BASE_URL}/accessories`).then(r => r.json()),
      ]);

      // Normaliza y etiqueta cada producto con su tipo
      return [
        ...vinyls.map(p => ({ ...p, type: "vinyl", displayName: p.tittle || p.title })),
        ...cds.map(p => ({ ...p, type: "cd", displayName: p.title })),
        ...turntables.map(p => ({ ...p, type: "turntable", displayName: `${p.brand} ${p.model}` })),
        ...accessories.map(p => ({ ...p, type: "accessory", displayName: p.name || p.title })),
      ];
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },
};