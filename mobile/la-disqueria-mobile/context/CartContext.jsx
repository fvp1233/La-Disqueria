import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../lib/apiClient';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'customer_cart';

export function CartProvider({ children }) {
  const [rows, setRows] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const mounted = useRef(true);

  // Cargar carrito guardado al iniciar
  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(CART_STORAGE_KEY);
        if (saved && mounted.current) {
          setRows(JSON.parse(saved));
        }
      } catch {
        // Si falla la lectura, empezar con carrito vacío
      } finally {
        if (mounted.current) {
          setHydrated(true);
        }
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (hydrated && rows.length >= 0) {
      SecureStore.setItemAsync(CART_STORAGE_KEY, JSON.stringify(rows));
    }
  }, [rows, hydrated]);

  const addItem = useCallback(
    (product, quantity = 1) => {
      setRows((current) => {
        const existing = current.find((r) => r.productId === product.id);
        if (existing) {
          return current.map((r) =>
            r.productId === product.id ? { ...r, quantity: r.quantity + quantity } : r
          );
        }
        return [...current, { productId: product.id, product, quantity }];
      });
    },
    []
  );

  const changeQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setRows((current) => current.filter((r) => r.productId !== productId));
    } else {
      setRows((current) =>
        current.map((r) => (r.productId === productId ? { ...r, quantity } : r))
      );
    }
  }, []);

  const removeItem = useCallback((productId) => {
    setRows((current) => current.filter((r) => r.productId !== productId));
  }, []);

  const clear = useCallback(() => {
    setRows([]);
  }, []);

  const subtotal = useMemo(
    () => rows.reduce((total, row) => total + (row.product?.price ?? 0) * row.quantity, 0),
    [rows]
  );

  const value = useMemo(
    () => ({
      rows,
      hydrated,
      subtotal,
      addItem,
      changeQuantity,
      removeItem,
      clear,
    }),
    [rows, hydrated, subtotal, addItem, changeQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return context;
}
