/*
   CART.JS
   Lógica para el Carrito de Compras usando localStorage
*/

// Array para manejar el carrito en memoria durante la sesión
var carrito = [];

// Función para cargar el carrito desde localStorage al iniciar la página
function cargarCarrito() {
    var datos = localStorage.getItem("mi_carrito");
    if (datos) {
        carrito = JSON.parse(datos);
    }
    actualizarContadorCarrito();
}

// Función para agregar producto al carrito
function agregarAlCarrito(id, nombre, precio) {
    // Verificamos si el producto ya existe en el carrito
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            carrito[i].cantidad++;
            guardarYActualizar();
            alert(nombre + " agregado correctamente");
            return;
        }
    }

    // Si no existe, lo agregamos como nuevo
    var producto = {
        id: id,
        nombre: nombre,
        precio: precio,
        cantidad: 1
    };

    carrito.push(producto);
    guardarYActualizar();
    alert(nombre + " agregado al carrito");
}

// Función para guardar en localStorage y actualizar la interfaz
function guardarYActualizar() {
    localStorage.setItem("mi_carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Función para actualizar el número del carrito en el menú
function actualizarContadorCarrito() {
    var totalItems = 0;
    for (var i = 0; i < carrito.length; i++) {
        totalItems += carrito[i].cantidad;
    }

    var contador = document.getElementById("cart-count");
    if (contador) {
        contador.innerHTML = totalItems;
    }
}

// Función para renderizar los items en la página carrito.html
function renderizarCarrito() {
    var tabla = document.getElementById("carrito-items");
    if (!tabla) return;

    if (carrito.length === 0) {
        tabla.innerHTML = "<tr><td colspan='5' style='text-align: center;'>El carrito está vacío</td></tr>";
        return;
    }

    var html = "";
    var totalGeneral = 0;

    for (var i = 0; i < carrito.length; i++) {
        var item = carrito[i];
        var subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;

        html += "<tr>" +
                "<td>" + item.nombre + "</td>" +
                "<td>" + item.cantidad + "</td>" +
                "<td>$" + item.precio + "</td>" +
                "<td>$" + subtotal + "</td>" +
                "<td><button class='btn btn-outline' onclick='eliminarItem(\" + item.id + "\")'>Borrar</button></td>" +
                "</tr>";
    }

    tabla.innerHTML = html;
    document.getElementById("total").innerHTML = "$" + totalGeneral;
}

// Función para eliminar un item del carrito
function eliminarItem(id) {
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].id === id) {
            carrito.splice(i, 1);
            break;
        }
    }
    guardarYActualizar();
    renderizarCarrito();
}

// Inicializar al cargar la página
window.onload = function() {
    cargarCarrito();
    if (document.getElementById("carrito-items")) {
        renderizarCarrito();
    }
};
