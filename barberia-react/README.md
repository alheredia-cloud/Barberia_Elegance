# 💈 Barbería Elegance — Frontend

Plataforma web para la venta de servicios y productos de barbería, con agenda de horas y panel interno de gestión.
El frontend (React) se comunica con una **API REST en Spring Boot** protegida con **JWT**.

- Backend: https://github.com/alheredia-cloud/Barberia_Elegance_Backend

## 🚀 Características

### 👤 Tienda (público / Cliente)
- **Catálogo** de servicios y productos obtenido desde `GET /api/v1/productos`.
- **Carrito** con control de stock disponible.
- **Checkout** (`POST /api/v1/boletas`): el backend valida stock, toma precios desde la BD y calcula el total.
- **Agenda** (`POST /api/v1/citas`): bloques de 30 min, horas ocupadas deshabilitadas.
- **Registro e inicio de sesión** con validación de RUT (dígito verificador) y correo.
- **Mis compras y citas**: historial del cliente.

### 🛠️ Panel interno (`/admin`)
| Sección | ADMIN | VENDEDOR |
|---|:-:|:-:|
| Dashboard (KPIs) | ✅ | — |
| Productos | ✅ CRUD | 👁️ lista y detalle |
| Categorías | ✅ CRUD | — |
| Órdenes (boletas) | ✅ ver / anular | 👁️ lista y detalle |
| Agenda | ✅ | — |
| Mensajes | ✅ | — |
| Usuarios y roles | ✅ | — |

Las secciones que un rol no puede usar **no se muestran**. El CLIENTE que intenta entrar a `/admin` es redirigido a `/no-autorizado`.

## 🔐 Sesión y seguridad
- `src/services/api.js`: instancia **axios** que adjunta `Authorization: Bearer <token>` y, si recibe 401 por expiración, renueva el token con `/auth/refresh` y reintenta la petición.
- `src/services/tokenStore.js`: el **access token** vive solo en memoria; el **refresh token** se guarda en `localStorage` para recuperar la sesión al recargar.
- `src/hooks/AuthContext.jsx`: al recargar la página pide un token nuevo al backend y obtiene el usuario y su **rol desde el servidor** (no desde el almacenamiento). Cierra la sesión si el refresh token expiró y sincroniza el cierre entre pestañas.
- `src/components/ProtectedRoute.jsx`: protege rutas por sesión y por rol.

## 💻 Stack
React 19 + Vite · React Router · React-Bootstrap · Axios · Context API · Vitest + Testing Library

## 📦 Ejecución
1. Levantar el backend (ver su README) en `http://localhost:8080`.
2. En `barberia-react/`:
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```
   Abrir `http://localhost:5173`.
3. (Opcional) Otra URL de backend: copiar `.env.example` a `.env` y ajustar `VITE_API_URL`.
4. Pruebas: `npm test`

## 🔑 Usuarios de prueba
| Rol | Email | Clave |
|---|---|---|
| ADMIN | admin@barberia.cl | admin123 |
| VENDEDOR | vendedor@barberia.cl | vendedor123 |
| CLIENTE | cliente@barberia.cl | cliente123 |

## 👥 Integrantes
- Bastian Canales
- Ian Muñoz
- Alexander Heredia
