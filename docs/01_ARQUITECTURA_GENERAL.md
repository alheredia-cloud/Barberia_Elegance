# 🏛️ 01. ARQUITECTURA GENERAL DEL SISTEMA

Este módulo describe la visión global de la aplicación **Barbería Elegance**, su propósito y la organización de sus componentes.

## 🎯 Objetivo del Proyecto
Crear una plataforma web integral que gestione la interacción entre clientes y administradores de una barbería, permitiendo la venta de servicios y productos, así como la gestión interna de inventario y usuarios.

## 🛠️ Stack Tecnológico
El sistema ha sido desarrollado siguiendo una arquitectura de **Frontend Puro (Client-Side)**:

- **HTML5**: Define la estructura semántica de cada vista.
- **CSS3**: Gestiona la estética y la adaptabilidad (Responsive Design).
- **JavaScript (ES6+)**: Controla la lógica de negocio y la manipulación dinámica del DOM.
- **Web Storage API**: Implementa el `localStorage` para persistir datos sin necesidad de un servidor.

## 📂 Organización de Carpetas
El proyecto se divide en tres áreas principales:

### 1. Zona Pública (`/public`)
Contiene todas las páginas accesibles para cualquier visitante. Se enfoca en la conversión del usuario (Registro $\rightarrow$ Compra).

### 2. Zona Administrativa (`/admin`)
Espacio restringido para el personal interno. Contiene las herramientas de gestión (CRUD) para mantener el negocio operativo.

### 3. Recursos Estáticos (`/assets`)
El cerebro del proyecto. Aquí reside toda la lógica en `/js` y el diseño en `/css`.

---
**Siguiente módulo sugerido:** [[02_AUTENTICACION_Y_SEGURIDAD]]