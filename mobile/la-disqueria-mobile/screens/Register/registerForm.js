// Validación y formateo del formulario de registro antes de enviarlo al backend.
// El backend exige DUI ########-# , teléfono ####-#### y una contraseña fuerte.

const DUI_REGEX = /^\d{8}-\d$/;
const PHONE_REGEX = /^\d{4}-\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,20}$/;

// Deja el DUI en el formato ########-# aunque llegue solo con dígitos.
export const formatDui = (value = "") => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 8) return digits;
  return `${digits.slice(0, 8)}-${digits.slice(8)}`;
};

// Deja el teléfono en el formato ####-#### que espera el backend.
export const formatPhone = (value = "") => {
  const digits = value.replace(/\D/g, "").replace(/^503/, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

/**
 * Construye el cuerpo de la petición o devuelve un error de validación.
 * @returns {{ payload?: object, error?: string }}
 */
export const buildRegisterPayload = (form) => {
  const name = form.name?.trim() ?? "";
  const lastName = form.lastName?.trim() ?? "";
  const dui = formatDui(form.dui ?? "");
  const email = form.email?.trim().toLowerCase() ?? "";
  const password = form.password?.trim() ?? "";
  const phone = formatPhone(form.phone ?? "");

  if (!name || !lastName || !dui || !email || !phone || !password) {
    return { error: "Completa todos los campos." };
  }
  if (name.length < 3 || name.length > 15) {
    return { error: "El nombre debe tener entre 3 y 15 caracteres." };
  }
  if (lastName.length < 3 || lastName.length > 15) {
    return { error: "El apellido debe tener entre 3 y 15 caracteres." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: "Ingresa un correo electrónico válido." };
  }
  if (!DUI_REGEX.test(dui)) {
    return { error: "El DUI debe tener el formato ########-#." };
  }
  if (!PHONE_REGEX.test(phone)) {
    return { error: "El teléfono debe tener 8 dígitos (####-####)." };
  }
  if (!PASSWORD_REGEX.test(password)) {
    return {
      error:
        "La contraseña debe tener de 8 a 20 caracteres e incluir mayúscula, minúscula, número y un carácter especial.",
    };
  }

  return {
    payload: { name, last_name: lastName, email, dui, phone, password },
  };
};
