# 💈 DOCUMENTACIÓN TÉCNICA: SISTEMA BARBERÍA ELEGANCE

Este documento constituye la guía completa de arquitectura, lógica y funcionamiento del sistema **Barbería Elegance**. Está diseñado para ser leído en Visual Studio Code utilizando la vista previa de Markdown (`Ctrl+Shift+V`).

---

## 📌 1. RESUMEN EJECUTIVO
El proyecto es una aplicación web de gestión de ventas y administración para una barbería. Implementa un flujo completo desde la captación del cliente hasta la gestión de inventario por parte del administrador, utilizando una arquitectura **Client-Side** pura con persistencia de datos simulada.

### 🛠️ Ficha Técnica
| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Estructura** | HTML5 | Semántica y organización de vistas |
| **Estilos** | CSS3 | Diseño responsivo y UI/UX |
| **Lógica** | JavaScript (ES6) | Procesamiento de datos y manipulación del DOM |
| **Persistencia** | Web Storage API | Simulación de Base de Datos mediante `localStorage` |
| **Seguridad** | RBAC (Role-Based Access Control) | Control de acceso basado en roles (Admin, Seller, Client) |

---

## 📂 2. MAPA ESTRUCTURAL DEL PROYECTO

```text
Barberia_Elegance/
├── admin/                    # 🔒 ZONA RESTRINGIDA
│   ├── index.html            # Dashboard de bienvenida admin
│   ├── productos-mgr.html    # CRUD de Inventario
│   └── usuarios-mgr.html     # CRUD de Usuarios
├── assets/                   # 🎨 RECURSOS ESTÁTICOS
│   ├── css/                  # Estilos (admin.css, components.css, styles.css)
│   └── js/                   # Núcleo Lógico (auth.js, cart.js, store.js, admin.js, validations.js)
├── public/                   # 🌍 ZONA PÚBLICA (CLIENTE)
│   ├── index.html            # Landing Page
│   ├── login.html            # Acceso
│   ├── registro.html         # Alta de usuarios
│   ├── productos.html        # Catálogo
│   ├── producto-detalle.html # Info específica de servicio
│   ├── carrito.html         # Checkout simulado
│   ├── contacto.html         # Comunicación
│   ├── nosotros.html         # Identidad de marca
│   ├── blog.html             # Artículos de tendencias
│   └── blog-detalle.html     # Lectura de artículo
└── DOCUMENTACION_TECNICA.md  # Este archivo
```

---

## 🧠 3. ANÁLISIS DETALLADO POR MÓDULO

### 🔐 Módulo de Autenticación (`assets/js/auth.js`)
Gestiona la identidad del usuario y la creación de sesiones.

*   **Flujo de Registro**: Captura datos $\rightarrow$ Valida correo/password $\rightarrow$ Guarda en `localStorage` con clave `usuario_{correo}`.
*   **Flujo de Login**: Busca clave en `localStorage` $\rightarrow$ Compara password $\rightarrow$ Crea `sesion_activa` y `rol_activa`.
*   **Punto Crítico**: El uso de `localStorage` permite que el usuario permanezca logueado incluso después de cerrar el navegador.

### 🛒 Módulo de Ventas y Carrito (`assets/js/cart.js` y `store.js`)
Implementa la lógica de comercio electrónico.

*   **`store.js`**: Actúa como el proveedor de datos inicial. Mapea los servicios (Corte, Barba, etc.) y los renderiza en el detalle del producto.
*   **`cart.js`**:
    *   **Lógica de Agregación**: Implementa un algoritmo que verifica si el ID ya existe en el carrito; si es así, incrementa la cantidad (`cantidad++`), evitando duplicados en la lista.
    *   **Cálculo de Totales**: Recorre el array del carrito multiplicando `precio * cantidad` para generar el subtotal y el total general.
    *   **Sincronización**: Cada cambio en el carrito dispara `guardarYActualizar()`, asegurando que la UI y el almacenamiento estén siempre alineados.

### 🛠️ Módulo de Administración (`assets/js/admin.js`)
Es el cerebro operativo del negocio. Implementa el patrón **CRUD**.

*   **Seguridad (The Gatekeeper)**: La función `verificarAccesoAdmin()` actúa como un middleware. Si `rol_activa` no es `Administrator` o `Seller`, expulsa al usuario hacia `login.html`.
*   **Gestión de Productos**: 
    *   Carga datos desde `admin_productos`.
    *   Permite crear nuevos productos o editar existentes usando un atributo `data-index` en el formulario para saber qué posición del array modificar.
*   **Gestión de Usuarios**: Similar a productos, pero incluye validaciones estrictas de datos personales (RUN, Dirección).

### 📏 Módulo de Validaciones (`assets/js/validations.js`)
Garantiza la integridad de la data mediante Expresiones Regulares (Regex).

*   **Regex de Correo**: `(@duoc\.cl|@profesor\.duoc\.cl|@gmail\.com)$` $\rightarrow$ Obliga el uso de correos institucionales o Gmail.
*   **Regex de RUN**: `^[0-9]{7,9}$` $\rightarrow$ Asegura que el RUN sea estrictamente numérico y tenga la longitud correcta, rechazando puntos o guiones.

---

## ⚙️ 4. LÓGICA DE PERSISTENCIA (EL "BACKEND" SIMULADO)

Dado que no hay servidor, el sistema utiliza el **localStorage** del navegador. La estructura de datos es la siguiente:

| Clave | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `usuario_{correo}` | Objeto JSON | Perfil del usuario (nombre, correo, password, rol) |
| `sesion_activa` | String | Correo del usuario logueado actualmente |
| `rol_activa` | String | Rol del usuario (permite acceso a /admin) |
| `mi_carrito` | Array de Objetos | Lista de productos seleccionados para compra |
| `admin_productos` | Array de Objetos | Inventario maestro gestionado por el administrador |
| `admin_usuarios` | Array de Objetos | Directorio de usuarios creado desde el panel admin |

---

## 🚀 5. GUÍA PARA LA PRESENTACIÓN Y ESTUDIO

Si debes explicar este código, sigue este orden lógico:

1.  **Entrada**: Muestra el **Registro/Login** $\rightarrow$ Explica que los datos se guardan en el navegador (`localStorage`).
2.  **Experiencia Cliente**: Navega por los **Productos** $\rightarrow$ Añade al **Carrito** $\rightarrow$ Explica cómo el JS calcula los totales dinámicamente.
3.  **Seguridad**: Intenta entrar a `/admin` sin loguearte $\rightarrow$ Muestra que el sistema te expulsa $\rightarrow$ Logueate como Admin $\rightarrow$ Muestra el acceso concedido.
4.  **Gestión**: Realiza un **CRUD** (Crea un producto, edítalo y bórralo) $\rightarrow$ Explica que esto actualiza la "base de datos" local.
5.  **Calidad**: Muestra el archivo `validations.js` $\rightarrow$ Explica que el sistema no acepta cualquier dato, sino que sigue reglas estrictas (Regex).

---

## 🎓 6. CONCEPTOS CLAVE PARA REPASAR
Para entender la totalidad del código, estudia estos temas:
- [ ] **DOM Manipulation**: `getElementById`, `innerHTML`, `onclick`.
- [ ] **JSON**: `JSON.stringify()` (objeto $\rightarrow$ texto) y `JSON.parse()` (texto $\rightarrow$ objeto).
- [ ] **Arrays**: `push()`, `splice()`, `forEach()` y bucles `for`.
- [ ] **Regex**: Cómo funcionan los patrones de búsqueda de texto.
- [ ] **Eventos**: `window.onload` y `preventDefault()`.
