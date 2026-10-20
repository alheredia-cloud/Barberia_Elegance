/*
   CART.JS
   Lógica para el Carrito de Compras integrada con storageService
*/

// Función para cargar el carrito y actualizar contador al iniciar
function inicializarCarrito() {
    actualizarContadorCarrito();
}

// Función para agregar producto al carrito utilizando el storageService
function agregarAlCarrito(id) {
    console.log("Intentando agregar producto con ID:", id);
    try {
        const productos = storageService.obtener('productos') || [];
        const producto = productos.find(p => p.id === id);

        if (!producto) {
            alert("Producto no encontrado");
            return;
        }

        if (producto.stock <= 0) {
            alert("Lo sentimos, este producto está agotado");
            return;
        }

        storageService.agregarAlCarrito(producto);
        actualizarContadorCarrito();
        alert(`${producto.nombre} agregado al carrito`);
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        alert("Hubo un error al agregar el producto al carrito.");
    }
}

// Función para actualizar el número del carrito en el menú
function actualizarContadorCarrito() {
    const carrito = storageService.obtener('carrito') || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const contador = document.getElementById("cart-count");
    if (contador) {
        contador.innerHTML = totalItems;
    }
}

// Función para renderizar los items en la página carrito.html
function renderizarCarrito() {
    const tabla = document.getElementById("carrito-items");
    if (!tabla) return;

    const carrito = storageService.obtener('carrito') || [];

    if (carrito.length === 0) {
        tabla.innerHTML = "<tr><td colspan='5' style='text-align: center;'>El carrito está vacío</td></tr>";
        return;
    }

    let html = "";
    let totalGeneral = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;

        html += `<tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio}</td>
                <td>$${subtotal}</td>
                <td><button class='btn btn-outline' onclick='eliminarItem(${item.id})'>Borrar</button></td>
                </tr>`;
    });

    tabla.innerHTML = html;
    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.innerHTML = `$${totalGeneral}`;
}

// Función para eliminar un item del carrito
function eliminarItem(id) {
    const carrito = storageService.obtener('carrito') || [];
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito.splice(index, 1);
        storageService.guardar('carrito', carrito);
    }

    actualizarContadorCarrito();
    renderizarCarrito();
}

// NUEVA FUNCIÓN: Finalizar Compra
function finalizarCompra() {
    console.log("Iniciando proceso de finalizar compra...");
    const carrito = storageService.obtener('carrito') || [];

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    try {
        console.log("Deduciendo stock...");
        // 1. Deducción de stock en el storageService
        carrito.forEach(item => {
            storageService.actualizarStock(item.id, item.cantidad);
        });

        console.log("Generando recibo...");
        // 2. Generar código de recibo único
        const recibo = 'REC-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // 3. Guardar el recibo usando el storageService (método simple)
        storageService.guardarSimple('ultimoRecibo', recibo);

        console.log("Vaciando carrito...");
        // 4. Vaciar el carrito
        storageService.guardar('carrito', []);
        actualizarContadorCarrito();

        console.log("Redirigiendo a página de éxito...");
        // 5. Redirigir a la página de compra exitosa
        window.location.href = 'comprar-ok.html';
    } catch (error) {
        console.error("ERROR CRÍTICO al finalizar la compra:", error);
        alert("Hubo un error técnico al procesar la compra. Por favor, revisa la consola.");
    }
}

// Inicializar al cargar la página sin sobrescribir window.onload
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrito();
    if (document.getElementById("carrito-items")) {
        renderizarCarrito();
    }
});
