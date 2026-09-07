import { request } from './client';

// Inicio de sesión de un cliente. Devuelve el token y los datos básicos.
export const loginCustomer = (email, password) =>
  request('/customers/login', { method: 'POST', body: { email, password } });

export const logoutCustomer = () => request('/logout', { method: 'POST', auth: true });

// Registro de un cliente. El backend envía un código al correo y devuelve el
// token de la sesión de registro para el paso de verificación.
export const registerCustomer = (form) =>
  request('/registerCustomer', {
    method: 'POST',
    body: {
      name: form.name,
      last_name: form.lastName,
      email: form.email,
      dui: form.dui,
      phone: form.phone,
      password: form.password,
    },
  });

export const verifyRegistrationCode = (code, registrationToken) =>
  request('/registerCustomer/verifyCodeEmail', {
    method: 'POST',
    body: { verificationCodeRequest: code, registrationToken },
  });

// Flujo de recuperación de contraseña en tres pasos.
export const requestPasswordCode = (email) =>
  request('/customers/passwordRecovery/request-code', {
    method: 'POST',
    body: { email },
  });

export const verifyPasswordCode = (code, recoveryToken) =>
  request('/customers/passwordRecovery/verify-code', {
    method: 'POST',
    body: { code, recoveryToken },
  });

export const resetPassword = (password, confirmPassword, recoveryToken) =>
  request('/customers/passwordRecovery/reset-password', {
    method: 'POST',
    body: { password, confirmPassword, recoveryToken },
  });

// Perfil del cliente autenticado.
export const getProfile = () => request('/customers/me', { auth: true });

export const updateProfile = (data) =>
  request('/customers/me', { method: 'PUT', auth: true, body: data });
