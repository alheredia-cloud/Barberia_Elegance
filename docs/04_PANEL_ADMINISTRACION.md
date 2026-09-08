# 🛠️ 04. PANEL DE ADMINISTRACIÓN

Detalle de las herramientas de gestión interna y el flujo de administración de datos.

## 🖥️ El Dashboard Administrativo
El panel de administración permite el control total sobre el inventario y los usuarios. Se basa en el patrón **CRUD** (Create, Read, Update, Delete).

## 📦 Gestión de Productos (`admin.js`)
Permite mantener el catálogo de servicios actualizado.

- **Creación/Edición**: El sistema utiliza un atributo `data-index` en el formulario. 
    - Si `data-index` es `null`, se crea un nuevo producto (`push`).
    - Si `data-index` tiene un valor, se sobrescribe la posición correspondiente en el array de `admin_productos`.
- **Eliminación**: Utiliza `splice(index, 1)` para remover la entrada del array y actualiza el `localStorage`.

## 👥 Gestión de Usuarios (`admin.js`)
Permite la administración de cuentas y asignación de roles.
- **Control de Datos**: Captura RUN, Nombre, Apellidos, Correo, Rol y Dirección.
- **Flujo de Guardado**: Al igual que los productos, utiliza un sistema de índices para diferenciar entre la creación de un usuario nuevo y la edición de uno existente.

## 🔒 Seguridad Integrada
Cada página del panel administrativo ejecuta al cargar (`window.onload`) la función `verificarAccesoAdmin()`, asegurando que ningún usuario no autorizado pueda manipular los datos del negocio.

---
**Siguiente módulo sugerido:** [[05_VALIDACIONES_Y_REGLAS]]