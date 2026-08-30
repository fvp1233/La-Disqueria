// Datos de muestra del catálogo mientras no exista conexión con el backend.
export const productTypes = ['Vinilos', 'CDs', 'Tocadiscos', 'Accesorios'];

const discTypes = ['Vinilos', 'CDs'];

const rawProducts = [
  { id: 'v1', sub: 'Chappell Roan', title: 'Midwest Princess', price: 34.99, genre: 'Pop', type: 'Vinilos', colors: ['#f6c1d9', '#7b2d5e'] },
  { id: 'v2', sub: 'Charli xcx', title: 'Brat', price: 32.0, genre: 'Hyperpop', type: 'Vinilos', colors: ['#b6e33d', '#38480a'] },
  { id: 'v3', sub: 'Fleetwood Mac', title: 'Rumours', price: 28.5, genre: 'Rock clásico', type: 'Vinilos', colors: ['#e8d6b0', '#6b4a2b'] },
  { id: 'v4', sub: 'Kendrick Lamar', title: 'GNX', price: 35.5, genre: 'Hip hop', type: 'Vinilos', colors: ['#cdb2e0', '#2e1a3d'] },
  { id: 'c1', sub: 'Billie Eilish', title: 'Hit Me Hard and Soft', price: 16.99, genre: 'Alt pop', type: 'CDs', colors: ['#9ec7e8', '#1c3a52'] },
  { id: 'c2', sub: 'Tyler, the Creator', title: 'Chromakopia', price: 18.0, genre: 'Hip hop', type: 'CDs', colors: ['#3f8f6b', '#122a20'] },
  { id: 'c3', sub: 'Sabrina Carpenter', title: 'Short n Sweet', price: 17.5, genre: 'Pop', type: 'CDs', colors: ['#f0c9a8', '#8a4b2a'] },
  { id: 't1', sub: 'Audio Technica', title: 'AT LP60X', price: 149.0, genre: 'Automático', type: 'Tocadiscos', colors: ['#c9ccd1', '#3a3f45'] },
  { id: 't2', sub: 'Fluance', title: 'RT81', price: 249.0, genre: 'Manual', type: 'Tocadiscos', colors: ['#d8b98f', '#4a3520'] },
  { id: 't3', sub: 'Victrola', title: 'Journey Plus', price: 79.0, genre: 'Portátil', type: 'Tocadiscos', colors: ['#b7a99a', '#43392f'] },
  { id: 'a1', sub: 'Mantenimiento', title: 'Kit de limpieza de vinilos', price: 24.0, genre: 'Cuidado', type: 'Accesorios', colors: ['#a8d5c8', '#274b43'] },
  { id: 'a2', sub: 'Protección', title: 'Fundas antiestáticas 50 unidades', price: 18.0, genre: 'Almacenaje', type: 'Accesorios', colors: ['#c5c9cf', '#3d4148'] },
  { id: 'a3', sub: 'Electrónica', title: 'Preamplificador de phono', price: 89.0, genre: 'Audio', type: 'Accesorios', colors: ['#b0b6bd', '#33373d'] },
];

export const products = rawProducts.map((item) => ({
  ...item,
  isDisc: discTypes.includes(item.type),
}));

export const findProductById = (productId) =>
  products.find((item) => item.id === productId) || products[0];

export const getProductsByType = (type) =>
  products.filter((item) => item.type === type);

export const sampleCartItems = [
  { productId: 'v3', quantity: 1 },
  { productId: 'c1', quantity: 2 },
];

export const formatPrice = (amount) => `$${amount.toFixed(2)}`;
