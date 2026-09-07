import { request } from './client';
import { FALLBACK_COVER, isDiscType } from '../utils/format';

// Da a los productos de la API una forma uniforme para la interfaz.
export const normalizeProduct = (item) => ({
  id: item._id || item.id,
  type: item.type,
  isDisc: isDiscType(item.type),
  title: item.album || 'Sin título',
  subtitle: item.artist || '',
  genre: item.genre || '',
  price: item.price ?? 0,
  cover: item.coverImage || FALLBACK_COVER,
  available: item.isAvailable ?? true,
  trackList: item.trackList || [],
  description: item.description || '',
  images: item.images || [],
});

// Listado paginado del catálogo. type acepta la clave de la API o queda vacío.
export const getProducts = ({ type, page = 1, limit = 12, sort } = {}) => {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (type) params.set('type', type);
  if (sort) params.set('sort', sort);

  return request(`/products?${params.toString()}`).then((result) => ({
    products: (result.data || []).map(normalizeProduct),
    total: result.total || 0,
    totalPages: result.totalPages || 1,
    page: result.page || page,
  }));
};

export const getProductById = (id) =>
  request(`/products/${id}`).then(normalizeProduct);

// Ranking de más vendidos calculado por el backend a partir de las órdenes.
export const getBestSellers = (limit = 6) =>
  request(`/orders/bestsellers?limit=${limit}`);
