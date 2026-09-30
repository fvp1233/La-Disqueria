import { request } from './client';

// Valoraciones de un producto con su promedio. No requiere sesión.
export const getProductReviews = (productId) => request(`/reviews/product/${productId}`);

// Crea o actualiza la valoración del cliente autenticado para un producto.
export const saveReview = ({ productId, rating, comment }) =>
  request('/reviews', {
    method: 'POST',
    auth: true,
    body: { productId, rating, comment },
  });

export const deleteReview = (reviewId) =>
  request(`/reviews/${reviewId}`, { method: 'DELETE', auth: true });

// Indica si el cliente ya compró el producto y por lo tanto puede valorarlo.
export const getReviewEligibility = (productId) =>
  request(`/reviews/product/${productId}/eligibility`, { auth: true });
