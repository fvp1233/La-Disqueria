import { useState } from "react";

const API_URL = "http://localhost:4000/api/cart";

const usePurchase = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submitPurchase = async ({ items, shipping_address, payment_method, notes }) => {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items, shipping_address, payment_method, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo completar la compra");
      }

      return data.cart;
    } catch (err) {
      setError(err.message || "Error al procesar la compra");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitPurchase, submitting, error };
};

export default usePurchase;
