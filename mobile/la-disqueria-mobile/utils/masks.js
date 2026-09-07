// Funciones que dan formato en vivo al texto que escribe el usuario en los campos.

export const onlyDigits = (value = '') => value.replace(/[^0-9]/g, '');

// Deja solo letras, espacios y algunos signos válidos en nombres.
export const maskName = (value = '') =>
  value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s'.-]/g, '').replace(/\s{2,}/g, ' ');

// Aplica el formato ########-# del DUI salvadoreño.
export const maskDui = (value = '') => {
  const digits = onlyDigits(value).slice(0, 9);
  if (digits.length <= 8) return digits;
  return `${digits.slice(0, 8)}-${digits.slice(8)}`;
};

// Aplica el formato ####-#### del teléfono salvadoreño.
export const maskPhone = (value = '') => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

// Deja un código alfanumérico de seis caracteres en minúscula.
export const maskCode = (value = '') =>
  value.replace(/[^A-Za-z0-9]/g, '').toLowerCase().slice(0, 6);
