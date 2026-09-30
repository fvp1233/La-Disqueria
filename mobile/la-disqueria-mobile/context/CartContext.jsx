import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProductById } from '../api/catalog';

const CartContext = createContext(null);

const cartKey = 'ld_cart_items';

// Límite de unidades de un mismo producto por compra (el mismo que valida la API).
export const MAX_QUANTITY = 99;

// Mayor cantidad permitida para una línea según el stock conocido del producto.
export const maxQuantityFor = (stock) =>
  stock == null ? MAX_QUANTITY : Math.max(0, Math.min(MAX_QUANTITY, stock));

const clampQuantity = (quantity, stock) => {
  const whole = Math.floor(Number(quantity) || 0);
  return Math.max(0, Math.min(whole, maxQuantityFor(stock)));
};

// Motivo por el que una línea del carrito no se puede comprar, o cadena vacía.
export const cartIssue = (item) => {
  if (item.available === false) return 'Ya no está disponible, elimínalo para continuar';
  if (item.stock === 0) return 'Agotado, elimínalo para continuar';
  if (item.stock != null && item.quantity > item.stock) {
    return `Solo quedan ${item.stock} unidades, ajusta la cantidad`;
  }
  return '';
};

// Descarta líneas guardadas con datos corruptos o cantidades no válidas.
const sanitize = (stored) =>
  (Array.isArray(stored) ? stored : [])
    .filter((item) => item && item.productId)
    .map((item) => ({
      ...item,
      price: Math.max(0, Number(item.price) || 0),
      stock: typeof item.stock === 'number' ? item.stock : null,
      quantity: clampQuantity(item.quantity, null),
    }))
    .filter((item) => item.quantity > 0);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    AsyncStorage.getItem(cartKey)
      .then((stored) => {
        if (stored) setItems(sanitize(JSON.parse(stored)));
      })
      .catch(() => setItems([]))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) {
      AsyncStorage.setItem(cartKey, JSON.stringify(items)).catch(() => {});
    }
  }, [items, ready]);

  const quantityOf = (productId) =>
    items.find((item) => item.productId === productId)?.quantity || 0;

  // Añade un producto respetando el stock. Devuelve cuántas unidades se
  // agregaron realmente (0 si ya no quedaba stock para sumar).
  const addItem = (product, quantity = 1) => {
    const inCart = quantityOf(product.id);
    const allowed = maxQuantityFor(product.stock) - inCart;
    const toAdd = Math.max(0, Math.min(Math.floor(quantity), allowed));

    if (toAdd === 0 || !product.available) return 0;

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                price: product.price,
                stock: product.stock,
                available: product.available,
                quantity: item.quantity + toAdd,
              }
            : item
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          type: product.type,
          title: product.title,
          subtitle: product.subtitle,
          price: product.price,
          image: product.cover,
          stock: product.stock,
          available: product.available,
          quantity: toAdd,
        },
      ];
    });

    return toAdd;
  };

  // Cambia la cantidad de una línea sin bajar de uno ni superar el stock.
  const setQuantity = (productId, quantity) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, clampQuantity(quantity, item.stock)) }
          : item
      )
    );
  };

  // Consulta la API para tener precio, disponibilidad y stock al día de cada
  // línea. Los productos que ya no existen quedan marcados como no disponibles.
  const refreshStock = useCallback(async () => {
    const results = await Promise.all(
      itemsRef.current.map((item) =>
        getProductById(item.productId)
          .then((product) => ({ id: item.productId, product }))
          .catch((error) => ({ id: item.productId, missing: error.status === 404 }))
      )
    );

    setItems((latest) =>
      latest.map((item) => {
        const result = results.find((entry) => entry.id === item.productId);
        if (!result) return item;
        if (result.missing) return { ...item, available: false };
        if (!result.product) return item;
        return {
          ...item,
          title: result.product.title,
          price: result.product.price,
          stock: result.product.stock,
          available: result.product.available,
        };
      })
    );
  }, []);

  const removeItem = (productId) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const hasIssues = useMemo(() => items.some((item) => cartIssue(item)), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        hasIssues,
        addItem,
        setQuantity,
        refreshStock,
        removeItem,
        clearCart,
        quantityOf,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
