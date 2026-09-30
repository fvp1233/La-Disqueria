// Reglas de edad para los clientes de la tienda.
export const MIN_AGE = 18;
export const MAX_AGE = 100;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Calcula la edad cumplida a la fecha de hoy.
export const ageFrom = (date) => {
  const today = new Date();
  let age = today.getFullYear() - date.getUTCFullYear();
  const monthDiff = today.getMonth() - date.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getUTCDate())) age -= 1;
  return age;
};

// Valida una fecha AAAA-MM-DD. Devuelve { date } si es válida o { message } con el error.
export const parseBirthdate = (value) => {
  if (typeof value !== "string" || !DATE_REGEX.test(value.trim())) {
    return { message: "La fecha de nacimiento no es válida" };
  }

  const [year, month, day] = value.trim().split("-").map(Number);
  // Se guarda a medianoche UTC para que el día no cambie según la zona horaria.
  const date = new Date(Date.UTC(year, month - 1, day));

  // Descarta fechas inexistentes como 2001-02-30.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return { message: "La fecha de nacimiento no es válida" };
  }

  if (date > new Date()) {
    return { message: "La fecha de nacimiento no puede ser futura" };
  }

  const age = ageFrom(date);
  if (age < MIN_AGE) {
    return { message: `Debes tener al menos ${MIN_AGE} años para registrarte` };
  }
  if (age > MAX_AGE) {
    return { message: "La fecha de nacimiento no es válida" };
  }

  return { date };
};
