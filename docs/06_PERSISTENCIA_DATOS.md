# 💾 06. PERSISTENCIA DE DATOS (LOCALSTORAGE)

Explicación detallada de cómo el sistema simula una base de datos utilizando la memoria del navegador.

## 📦 Concepto de Persistencia Local
El sistema utiliza el **Web Storage API**, específicamente `localStorage`. A diferencia de las variables comunes de JavaScript, los datos en `localStorage` no se borran al refrescar la página ni al cerrar el navegador.

## 🛠️ Manipulación de Datos JSON
Como `localStorage` solo puede guardar texto (strings), el sistema utiliza dos funciones críticas de JavaScript:
1. `JSON.stringify(objeto)`: Convierte un array o un objeto de JS en una cadena de texto para poder guardarlo.
2. `JSON.parse(texto)`: Convierte el texto guardado nuevamente en un objeto o array para poder manipularlo en el código.

## 🔑 Mapa de Claves y Valores
A continuación, se detallan las claves utilizadas en el sistema y qué contienen:

| Clave | Formato | Contenido | Uso Principal |
| :--- | :--- | :--- | :--- |
| `usuario_{correo}` | Objeto JSON | `{nombre, correo, password, rol}` | Autenticación y Perfil |
| `sesion_activa` | String | `correo@ejemplo.com` | Identificar al usuario logueado |
| `rol_activa` | String | `Administrator` / `Seller` / `Client` | Control de acceso a `/admin` |
| `mi_carrito` | Array JSON | `[{id, nombre, precio, cantidad}, ...]` | Gestión de compras |
| `admin_productos` | Array JSON | `[{codigo, nombre, categoria, precio, stock, desc}, ...]` | Inventario Maestro |
| `admin_usuarios` | Array JSON | `[{run, nombre, apellidos, correo, rol, direccion}, ...]` | Directorio de Usuarios |

## ⚠️ Limitaciones del Sistema
Al ser una persistencia local:
- Los datos son **específicos por navegador y computadora**. Si el usuario abre el sitio en otro PC, no verá sus datos.
- No existe un respaldo centralizado (servidor).

---
**Fin de la documentación técnica.**