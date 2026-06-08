const API_URL = "http://localhost:4000/api/customers";

// Obtiene todos los clientes registrados
export const getCustomers = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Error al obtener los clientes");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Crea un nuevo cliente
export const createCustomer = async (customerData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Actualiza la información de un cliente
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el cliente");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Elimina un cliente por su id
export const deleteCustomer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el cliente");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};