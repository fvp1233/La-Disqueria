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
