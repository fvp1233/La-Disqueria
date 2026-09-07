# La Disquería · Aplicación móvil

Aplicación móvil para clientes de la tienda en línea **La Disquería**. Permite crear
una cuenta, iniciar sesión, recuperar la contraseña, explorar el catálogo completo
(vinilos, CDs, tocadiscos y accesorios), ver la ficha de cada producto, armar un
carrito y registrar pedidos contra la misma base de datos que usa la tienda web y
el panel administrativo.

## Integrantes

   Nombre completo                    Carné 
 - Fernando Miguel Velásquez Pérez  - 20240216
 - Gabriela Isabel Castillo Mena    - 20240153
 - Daniela Elizabet Villalta Sorto  - 20240286
 - Natalie Abigail Navarro Góchez   - 20230301
 - Freddy Ricardo Pérez Alvarenga   - 20220502|

- Especialidad: Desarrollo de Software · Tercer año
- Módulo 5: Desarrollo de componentes para dispositivos móviles

## Stack

- **Expo** SDK 57 con React Native 0.86 y React 19
- **React Navigation** 7 (stack nativo + bottom tabs)
- **AsyncStorage** para la sesión y el carrito local
- **expo-constants** para detectar la IP del backend automáticamente
- **@expo/vector-icons** (Feather) para la iconografía
- API REST del proyecto (Express + MongoDB) en `../../backend`

## Estructura de carpetas

```
App.js                 Punto de entrada. Solo monta los providers y la navegación.
api/                   config.js resuelve la URL del backend; client.js es el
                       cliente HTTP; el resto son funciones por recurso
                       (auth, catalog, orders).
context/               AuthContext (sesión) y CartContext (carrito persistido).
navigation/            RootNavigator, MainTabs y el tema de navegación.
screens/               Una subcarpeta por funcionalidad. Cada pantalla usa
                       PascalCase y termina en Screen. Los componentes propios de
                       una sola pantalla viven en su carpeta components/.
components/             Componentes reutilizables por varias pantallas
                       (botones, campos de texto, tarjetas, banners, etc.).
utils/                 Máscaras de entrada, validaciones, formato y traducción de
                       errores del backend.
theme/                 Paleta de colores, tipografías, espaciado y sombras.
assets/               Icono, icono adaptable y la imagen del splash.
```

## Pantallas

- **Carga y bienvenida:** pantalla de carga animada (restaura la sesión) y
  onboarding que se muestra una sola vez.
- **Sesión:** inicio de sesión, registro con verificación por código y
  recuperación de contraseña en tres pasos más la pantalla de confirmación.
- **Tienda:** inicio con novedades y más vendidos, catálogo separado por los
  cuatro tipos de producto con carga por páginas, y ficha de producto.
- **Compra:** carrito, checkout y confirmación de pedido.
- **Cuenta:** perfil, edición de datos, historial de pedidos y ayuda.

## Requisitos previos

1. Node.js 18 o superior.
2. La aplicación **Expo Go** en el teléfono, o un emulador de Android / simulador de iOS.
3. El backend del proyecto corriendo. Desde `../../backend`:

   ```bash
   npm install
   npm run dev        # levanta el servidor en el puerto 4000
   ```

   El backend necesita un archivo `.env` con `DB_URL`, `JWT_Secret_key`,
   `USER_EMAIL` y `USER_PASSWORD` (cuenta de Gmail con contraseña de aplicación
   para el envío de los códigos por correo).

## Instalación y ejecución

```bash
npm install
npx expo start
```

Luego se escanea el código QR con Expo Go o se abre el emulador con `a` (Android)
o `i` (iOS).

## Configuración de la dirección del backend

La URL de la API se resuelve sola en `api/config.js`, así que **normalmente no hay
que cambiar ningún archivo aunque cambie la IP del equipo**:

- **Teléfono con Expo Go (red de cable o wifi):** la app toma la IP del equipo
  desde Expo (`Constants.expoConfig.hostUri`). Si la IP cambia, Expo la actualiza
  al reiniciar `npx expo start` y la app la usa automáticamente.
- **Emulador de Android Studio:** usa `http://10.0.2.2:4000`, que apunta al
  `localhost` del equipo.
- **Simulador de iOS o web:** usa `http://localhost:4000`.

Solo si la detección automática falla (túnel, VPN, varias tarjetas de red) se
crea un archivo `.env` (ver `.env.example`) con la IP fija:

```
EXPO_PUBLIC_API_URL=http://192.168.1.50:4000
```

### Requisitos para que el teléfono alcance el backend

1. El teléfono y la computadora deben estar en la **misma red** (mismo router).
2. El backend ya escucha en todas las interfaces (`app.listen(4000)`), no hay que
   cambiarlo.
3. En Windows, permitir el puerto **4000** en el Firewall la primera vez
   (aparece un aviso al arrancar el backend, o crear la regla de entrada para
   `node.exe` / TCP 4000).
4. Averiguar la IP del equipo con `ipconfig` (campo *Dirección IPv4* de la
   conexión de cable, normalmente `192.168.x.x`).

### Si el teléfono no puede estar en la misma red (datos móviles)

La opción más simple es usar el **emulador de Android Studio**: al correr
`npx expo start` y pulsar `a`, Expo instala en el emulador la versión de Expo Go
que corresponde al SDK del proyecto, y el backend se alcanza por `10.0.2.2:4000`
sin configurar nada más.

Para un teléfono físico fuera de la red hay que exponer las dos cosas:

```bash
# 1. Metro por túnel
npx expo start --tunnel

# 2. El backend por un túnel público (en otra terminal, dentro de ../../backend)
npx localtunnel --port 4000        # o: ngrok http 4000
```

Luego se crea un archivo `.env` con la URL pública del backend:

```
EXPO_PUBLIC_API_URL=https://xxxx.loca.lt
```

## Datos para las pruebas

Debe existir información en la base de datos para demostrar el funcionamiento:

- Productos en las colecciones `vinyls`, `cds`, `turntables` y `accessories`.
- Al menos un cliente registrado y verificado para iniciar sesión, o crear uno
  nuevo desde la pantalla de registro (el código llega al correo indicado).

## Convenciones de código

- **Pantallas y componentes:** PascalCase en inglés, con sufijo `Screen` para las
  pantallas.
- **Variables, funciones y constantes:** camelCase.
- **Estilos:** `StyleSheet.create` al final de cada archivo.
