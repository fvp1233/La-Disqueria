import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Puerto donde corre el backend del proyecto.
const backendPort = 4000;

// Opción 1: dirección fija escrita a mano.
// Se usa solo si se define EXPO_PUBLIC_API_URL en un archivo .env
// (por ejemplo EXPO_PUBLIC_API_URL=http://192.168.1.50:4000).
const manualUrl = process.env.EXPO_PUBLIC_API_URL;

// Opción 2: dirección detectada automáticamente.
// Expo conoce la IP del equipo que corre Metro y la comparte en hostUri
// ("192.168.1.50:8081"). Al cambiar la IP del equipo, Expo la actualiza sola,
// así que no hay que tocar ningún archivo.
const metroHostUri =
  Constants.expoConfig?.hostUri ||
  Constants.expoGoConfig?.debuggerHost ||
  Constants.manifest2?.extra?.expoClient?.hostUri ||
  '';

const detectedHost = metroHostUri.split(':')[0];

const isLocalHost = (value) =>
  !value || value === 'localhost' || value === '127.0.0.1';

// Cuando Expo corre con --tunnel el host es un dominio de Expo, no la IP del
// equipo, así que no sirve para llegar al backend: en ese caso hay que definir
// EXPO_PUBLIC_API_URL con una URL pública del backend.
const isTunnelHost = (value) =>
  /\.exp\.direct$|\.exp\.host$|\.ngrok|\.trycloudflare\.com$/.test(value || '');

const resolveBaseUrl = () => {
  if (manualUrl) {
    return manualUrl.replace(/\/+$/, '');
  }

  // Teléfono con Expo Go en la misma red de cable o wifi.
  if (!isLocalHost(detectedHost) && !isTunnelHost(detectedHost)) {
    return `http://${detectedHost}:${backendPort}`;
  }

  // Emulador de Android Studio: 10.0.2.2 apunta al localhost del equipo.
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${backendPort}`;
  }

  // Simulador de iOS o web en el mismo equipo.
  return `http://localhost:${backendPort}`;
};

export const apiUrl = `${resolveBaseUrl()}/api`;
