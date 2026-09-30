// Reglas de validación reutilizables para los formularios de la aplicación.

export const isEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isDui = (value = '') => /^\d{8}-\d$/.test(value.trim());

export const isPhone = (value = '') => /^\d{4}-\d{4}$/.test(value.trim());

export const isValidName = (value = '') => {
  const trimmed = value.trim();
  return trimmed.length >= 3 && trimmed.length <= 15;
};

export const passwordChecks = (value = '') => ({
  length: value.length >= 8 && value.length <= 20,
  upper: /[A-Z]/.test(value),
  lower: /[a-z]/.test(value),
  number: /[0-9]/.test(value),
  special: /[^A-Za-z0-9]/.test(value),
});

export const isStrongPassword = (value = '') =>
  Object.values(passwordChecks(value)).every(Boolean);

export const isNotEmpty = (value = '') => value.trim().length > 0;

// Edad mínima para crear una cuenta y comprar en la tienda.
export const MIN_AGE = 18;
export const MAX_AGE = 100;

// Convierte DD/MM/AAAA en AAAA-MM-DD. Devuelve null si la fecha no existe.
export const displayDateToIso = (value = '') => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return `${yyyy}-${mm}-${dd}`;
};

// Convierte la fecha que devuelve la API (ISO) al formato DD/MM/AAAA.
export const isoToDisplayDate = (value) => {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
};

// Edad cumplida hoy a partir de una fecha AAAA-MM-DD.
export const ageFromIso = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) age -= 1;
  return age;
};

// Valida la fecha de nacimiento. Devuelve el mensaje de error o una cadena vacía.
export const birthdateError = (value = '') => {
  if (!isNotEmpty(value)) return 'Ingresa tu fecha de nacimiento';
  const iso = displayDateToIso(value);
  if (!iso) return 'Usa el formato DD/MM/AAAA con una fecha real';
  const age = ageFromIso(iso);
  if (age < 0) return 'La fecha no puede ser futura';
  if (age < MIN_AGE) return `Debes tener al menos ${MIN_AGE} años`;
  if (age > MAX_AGE) return 'Revisa el año de nacimiento';
  return '';
};

// Valida una línea de dirección de envío.
export const addressError = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed) return 'Ingresa una dirección';
  if (trimmed.length < 5) return 'La dirección es muy corta';
  if (trimmed.length > 150) return 'Máximo 150 caracteres';
  return '';
};

export const cityError = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed) return 'Ingresa una ciudad';
  if (trimmed.length < 3) return 'La ciudad es muy corta';
  if (trimmed.length > 60) return 'Máximo 60 caracteres';
  return '';
};

// Cantidad válida para el carrito: entero positivo sin superar el stock.
export const isValidQuantity = (value, max) =>
  Number.isInteger(value) && value >= 1 && (max == null || value <= max);
