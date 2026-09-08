# 🔐 02. AUTENTICACIÓN Y SEGURIDAD

Este módulo detalla cómo el sistema gestiona la identidad de los usuarios y protege el acceso a áreas restringidas.

## 🔑 Proceso de Autenticación (`assets/js/auth.js`)

### Registro de Usuarios
Cuando un usuario se registra, el sistema realiza lo siguiente:
1. Captura los datos del formulario.
2. Valida el correo y la contraseña mediante `validations.js`.
3. Crea un objeto de usuario y lo guarda en `localStorage` usando el correo como clave única: `usuario_{correo}`.
4. Asigna por defecto el rol de `"Client"`.

### Inicio de Sesión (Login)
1. El sistema busca en `localStorage` si existe la clave `usuario_{correo}`.
2. Compara la contraseña ingresada con la almacenada.
3. Si es correcta, crea dos tokens de sesión en el almacenamiento local:
    - `sesion_activa`: Almacena el correo del usuario.
    - `rol_activa`: Almacena el rol (Client, Administrator, o Seller).

## 🛡️ Control de Acceso Basado en Roles (RBAC)
La seguridad del sistema no se basa en rutas ocultas, sino en una verificación activa.

En el archivo `admin.js`, existe la función `verificarAccesoAdmin()`, la cual:
- Lee el valor de `rol_activa`.
- Si el valor **no es** `"Administrator"` ni `"Seller"`, el sistema dispara una alerta de "Acceso Denegado" y redirige inmediatamente al usuario a `public/login.html`.

---
**Siguiente módulo sugerido:** [[03_TIENDA_Y_CARRITO]]