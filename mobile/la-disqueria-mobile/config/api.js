import { Platform } from 'react-native';

// URL base del backend de La Disquería.
// - Emulador Android: 10.0.2.2 apunta al localhost de la máquina anfitriona.
// - Simulador iOS / web: localhost funciona directamente.
// - Dispositivo físico: reemplaza DEV_LAN_HOST por la IP local de tu equipo
//   (por ejemplo http://192.168.1.5:4000/api) y ponla en Platform.select.
const DEV_LAN_HOST = 'http://localhost:4000/api';

export const API_URL = Platform.select({
  android: 'http://10.0.2.2:4000/api',
  ios: 'http://localhost:4000/api',
  default: DEV_LAN_HOST,
});
