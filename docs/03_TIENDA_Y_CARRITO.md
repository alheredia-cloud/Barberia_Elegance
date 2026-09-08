# 🛒 03. TIENDA Y CARRITO DE COMPRAS

Análisis de la lógica de ventas y la experiencia de compra del cliente.

## 📦 Catálogo de Productos (`assets/js/store.js`)
El catálogo es el punto de entrada para el cliente.
- **Datos Maestros**: El sistema posee un array de objetos `productos` que define el nombre, categoría, precio y descripción de cada servicio.
- **Renderizado Dinámico**: La función `cargarDetalleProducto()` permite mostrar la información de un servicio específico, facilitando que el usuario conozca los detalles antes de comprar.

## 🛍️ Lógica del Carrito (`assets/js/cart.js`)
El carrito de compras es la funcionalidad más interactiva del lado del cliente.

### Algoritmo de Adición
Para evitar que el carrito se llene de productos repetidos, se utiliza la siguiente lógica:
1. El sistema recorre el array `carrito`.
2. Si el `id` del producto ya existe, simplemente aumenta la propiedad `cantidad`.
3. Si el `id` no existe, añade un nuevo objeto al array.

### Gestión de Totales
La función `renderizarCarrito()` realiza un cálculo en tiempo real:
$$\text{Subtotal} = \text{Precio} \times \text{Cantidad}$$
$$\text{Total General} = \sum \text{Subtotales}$$

### Persistencia del Carrito
Cada vez que se añade o elimina un producto, se ejecuta `guardarYActualizar()`, que escribe el estado actual del carrito en la clave `mi_carrito` de `localStorage`.

---
**Siguiente módulo sugerido:** [[04_PANEL_ADMINISTRACION]]