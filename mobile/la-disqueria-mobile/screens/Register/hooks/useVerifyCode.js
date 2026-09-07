import { useState } from 'react';
import apiClient from '../../../lib/apiClient';

// Traduce los mensajes del backend (en inglés) a algo mostrable al usuario.
const friendlyMessage = (message = '') => {
  const map = {
    'Invalid code': 'El código no es correcto. Verifícalo e inténtalo de nuevo.',
    'Expired registration': 'El registro expiró. Vuelve a crear tu cuenta.',
    'Customer already exists': 'Esta cuenta ya fue verificada. Inicia sesión.',
  };
  return map[message] || message || 'No se pudo verificar el código.';
};

/**
 * Maneja el segundo paso del registro: envía el código de 6 caracteres al
 * backend (POST /api/registerCustomer/verifyCodeEmail). El backend lee la
 * cookie registrationCookie generada al registrarse y, si el código coincide,
 * crea al cliente.
 */
export default function useVerifyCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyCode = async (code) => {
    setError(null);

    // El código generado por el backend son 6 caracteres hexadecimales en minúscula.
    const verificationCodeRequest = code?.trim().toLowerCase() ?? '';

    if (verificationCodeRequest.length !== 6) {
      setError('Ingresa el código de 6 caracteres que enviamos a tu correo.');
      return false;
    }

    try {
      setLoading(true);
      await apiClient('/registerCustomer/verifyCodeEmail', {
        method: 'POST',
        body: { verificationCodeRequest },
      });

      return true;
    } catch (requestError) {
      setError(friendlyMessage(requestError.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verifyCode, loading, error, setError };
}
