import { request } from './client';

// Registra la compra del carrito. El backend crea la orden y devuelve su número.
export const checkout = ({ items, shippingAddress, paymentMethod, notes }) =>
  request('/cart', {
    method: 'POST',
    auth: true,
    body: {
      items: items.map((item) => ({
        productId: item.productId,
        type: item.type,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      notes,
    },
  });

// Historial de compras del cliente autenticado.
export const getOrderHistory = () => request('/cart', { auth: true });
