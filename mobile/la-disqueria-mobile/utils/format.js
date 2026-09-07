// Ayudas de formato y traducción de tipos de producto entre la interfaz y la API.

export const formatPrice = (amount) => `$${Number(amount || 0).toFixed(2)}`;

export const productTypes = ['Vinilos', 'CDs', 'Tocadiscos', 'Accesorios'];

const uiToApi = {
  Vinilos: 'vinyl',
  CDs: 'cd',
  Tocadiscos: 'turntable',
  Accesorios: 'accessory',
};

const apiToUi = {
  vinyl: 'Vinilos',
  cd: 'CDs',
  turntable: 'Tocadiscos',
  accessory: 'Accesorios',
};

export const uiTypeToApi = (uiType) => uiToApi[uiType] || uiType;

export const apiTypeToUi = (apiType) => apiToUi[apiType] || apiType;

export const isDiscType = (apiType) => apiType === 'vinyl' || apiType === 'cd';

export const FALLBACK_COVER = 'https://placehold.co/600x600/ece5db/9c9587?text=La+Disquer%C3%ADa';
