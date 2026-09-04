# 💈 Barbería Elegance - Sistema de Gestión y Ventas

Este proyecto es una aplicación web desarrollada para la evaluación del curso **DSY1104**. Consiste en un sitio web integral para una barbería, que permite a los clientes explorar servicios y realizar compras, mientras que los administradores pueden gestionar el inventario y los usuarios.

## 🚀 Funcionalidades

### Para el Cliente
- **Registro y Autenticación:** Creación de cuentas con validación de correos electrónicos institucionales (`@duoc.cl`, `@profesor.duoc.cl`) y Gmail.
- **Catálogo de Servicios:** Visualización de productos y servicios organizados por categorías y precios.
- **Detalle de Producto:** Información detallada de cada servicio.
- **Carrito de Compras:** Gestión de productos seleccionados con persistencia de datos.
- **Formulario de Contacto:** Envío de mensajes con validaciones de longitud de texto.

### Para el Administrador / Vendedor
- **Panel de Administración:** Acceso restringido mediante control de roles.
- **Gestión de Productos (CRUD):** Capacidad de crear, leer, editar y eliminar productos, con validación de precios y stock.
- **Gestión de Usuarios (CRUD):** Administración de cuentas de usuario con validación de RUN (7-9 dígitos).

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica de las páginas.
- **CSS3:** Diseño visual y responsivo.
- **JavaScript (ES6):** Lógica de negocio, validaciones y manipulación del DOM.
- **Web Storage API (`localStorage`):** Implementado como capa de persistencia para simular una base de datos (Usuarios, Sesiones, Carrito y Productos).

## 📦 Estructura del Proyecto

```text
├── admin/                 # Panel de administración (Acceso restringido)
│   ├── index.html         # Dashboard principal
│   ├── productos-mgr.html # Gestión de productos
│   └── usuarios-mgr.html   # Gestión de usuarios
├── assets/                # Recursos estáticos
│   └── js/                # Lógica de JavaScript (auth.js, cart.js, admin.js)
├── public/                # Páginas accesibles al público
│   ├── index.html         # Página de inicio
│   ├── productos.html      # Catálogo
│   ├── carrito.html       # Vista del carrito
│   ├── login.html         # Acceso de usuarios
│   └── registro.html       # Creación de cuentas
└── README.md              # Documentación del proyecto
```

## ⚙️ Instrucciones de Ejecución

Dado que el proyecto utiliza tecnologías frontend y `localStorage`, no requiere de un servidor externo para funcionar:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/alheredia-cloud/Barberia_Elegance.git
   ```
2. Abrir el archivo `public/index.html` en cualquier navegador moderno.

---
**Desarrollado para la Evaluación Parcial 1 - DSY1104**
