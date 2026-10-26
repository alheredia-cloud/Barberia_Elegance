# 💈 Barbería Elegance

Una plataforma web integral y moderna diseñada para optimizar la gestión de servicios de barbería y la venta de productos especializados. El sistema combina una experiencia de usuario intuitiva para los clientes con un panel de control robusto para la administración del negocio.

## 🚀 Características Principales

### 👤 Interfaz del Cliente
- **Catálogo Interactivo:** Exploración de servicios (cortes, barba, combos) y productos físicos.
- **Carrito de Compras Inteligente:** Gestión de productos con cálculo de totales en tiempo real.
- **Agendamiento Vinculante:** Sistema obligatorio de reserva de fecha y hora al contratar servicios, asegurando la organización de la agenda.
- **Autenticación Segura:** Módulo de registro e inicio de sesión con validaciones estrictas de RUT y correo electrónico.

### 🛠️ Panel de Administración (AdminDashboard)
- **Control de Acceso:** Rutas protegidas exclusivas para el rol de `Administrator`.
- **Métricas en Tiempo Real (KPIs):** Monitoreo instantáneo de usuarios, productos, valor de inventario y mensajes.
- **Gestión de Inventario (CRUD):** Control total sobre productos y servicios, con reglas de negocio diferenciadas (Stock Ilimitado para servicios y Control Numérico para productos).
- **Administración de Usuarios:** Gestión de cuentas, cambio de roles y filtrado avanzado.
- **Bandeja de Mensajes:** Centralización de la comunicación con los clientes.
- **Agenda Centralizada:** Visualización detallada de todas las citas programadas.

## 💻 Stack Tecnológico

- **Frontend:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos:** [Bootstrap 5](https://getbootstrap.com/)
- **Gestión de Estado:** React Context API (Sincronización global inmediata entre Admin y Tienda).
- **Persistencia:** LocalStorage mediante arquitectura de patrón Singleton (`storageService`).
- **Pruebas Unitarias:** [Vitest](https://vitest.dev/) + JSDOM.

## 📦 Instalación y Ejecución

Sigue estos pasos para correr el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd barberia-react
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   Luego, abre el navegador en la dirección que indique la terminal (usualmente `http://localhost:5173`).

4. **Ejecutar las pruebas unitarias:**
   ```bash
   npm test
   ```

## 🔑 Credenciales de Acceso (Prueba)

Para acceder al panel administrativo, utiliza la siguiente cuenta predefinida:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
- **Rol:** `Administrator`

## 👥 Integrantes
- Bastian Canales
- Ian Muñoz
- Alexander Heredia

---
*Proyecto desarrollado para la asignatura de Desarrollo Web - Octubre 2026.*
