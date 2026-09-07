import { useState } from 'react';
import apiClient from '../../../lib/apiClient';

const DUI_REGEX = /^\d{8}-\d$/;
const PHONE_REGEX = /^\d{4}-\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._])[A-Za-z\d@$!%*?&#._]{8,20}$/;

// Deja el DUI en el formato ########-# aunque llegue solo con dígitos.
const formatDui = (value = '') => {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 8) return digits;
  return `${digits.slice(0, 8)}-${digits.slice(8)}`;
};

// Deja el teléfono en el formato ####-#### que espera el backend.
const formatPhone = (value = '') => {
  const digits = value.replace(/\D/g, '').replace(/^503/, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

// Traduce los mensajes del backend (en inglés) a algo mostrable al usuario.
const friendlyMessage = (message = '') => {
  const map = {
    'Email already registered': 'Ese correo ya tiene una cuenta.',
    'DUI already registered': 'Ese DUI ya está registrado.',
    'Phone already registered': 'Ese teléfono ya está registrado.',
    'Fields required': 'Completa todos los campos.',
  };
  return map[message] || message || 'No se pudo crear la cuenta.';
};

/**
 * Maneja el primer paso del registro: valida el formulario y pide al backend
 * que envíe el código de verificación al correo (POST /api/registerCustomer).
 * El backend responde con una cookie (registrationCookie) que React Native
 * guarda automáticamente y reenvía al verificar el código.
 */
export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (form) => {
    setError(null);

    const name = form.name?.trim() ?? '';
    const lastName = form.lastName?.trim() ?? '';
    const dui = formatDui(form.dui ?? '');
    const email = form.email?.trim().toLowerCase() ?? '';
    const password = form.password?.trim() ?? '';
    const phone = formatPhone(form.phone ?? '');

    if (!name || !lastName || !dui || !email || !phone || !password) {
      setError('Completa todos los campos.');
      return null;
    }
    if (name.length < 3 || name.length > 15) {
      setError('El nombre debe tener entre 3 y 15 caracteres.');
      return null;
    }
    if (lastName.length < 3 || lastName.length > 15) {
      setError('El apellido debe tener entre 3 y 15 caracteres.');
      return null;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError('Ingresa un correo electrónico válido.');
      return null;
    }
    if (!DUI_REGEX.test(dui)) {
      setError('El DUI debe tener el formato ########-#.');
      return null;
    }
    if (!PHONE_REGEX.test(phone)) {
      setError('El teléfono debe tener 8 dígitos (####-####).');
      return null;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setError(
        'La contraseña debe tener de 8 a 20 caracteres e incluir mayúscula, minúscula, número y un carácter especial.',
      );
      return null;
    }

    try {
      setLoading(true);
      await apiClient('/registerCustomer', {
        method: 'POST',
        body: { name, last_name: lastName, email, dui, phone, password },
      });

      // El correo se devuelve para mostrarlo en la pantalla de verificación.
      return { email };
    } catch (requestError) {
      setError(friendlyMessage(requestError.message));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, setError };
}
