import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateApiError } from '../utils/apiErrors';
import { apiUrl } from './config';

export { apiUrl };

const tokenKey = 'ld_auth_token';

export const saveToken = (token) => AsyncStorage.setItem(tokenKey, token);
export const readToken = () => AsyncStorage.getItem(tokenKey);
export const clearToken = () => AsyncStorage.removeItem(tokenKey);

export class ApiError extends Error {
  constructor(message, status) {
    super(translateApiError(message));
    this.status = status;
    this.rawMessage = message;
  }
}

const parseBody = (text) => {
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
};

// Realiza una petición a la API. Con auth en verdadero adjunta el token de sesión
// como cookie, que es la forma en que el backend valida al usuario.
export async function request(path, options = {}) {
  const { method = 'GET', body, auth = false, headers = {} } = options;

  const finalHeaders = { 'Content-Type': 'application/json', ...headers };

  if (auth) {
    const token = await readToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
      finalHeaders.Cookie = `authCookie=${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new ApiError('No pudimos conectar con el servidor', 0);
  }

  const data = parseBody(await response.text());

  if (!response.ok) {
    throw new ApiError(data.message, response.status);
  }

  return data;
}
