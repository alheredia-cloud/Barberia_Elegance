/*
   STORE.JS
   Lógica para mostrar los productos y el blog
*/

// Datos de ejemplo según el Plan (Simulación de Base de Datos)
var productos = [
    { id: "SERV01", nombre: "Corte Clásico", cat: "Cortes", precio: 10000, desc: "Corte tradicional con tijera y máquina.", imagen: "../imagenes/corte clasico.jpe" },
    { id: "SERV02", nombre: "Barba Completa", cat: "Barba", precio: 7000, desc: "Perfilado y recorte de barba con toalla caliente.", imagen: "../imagenes/Barba completa.jpe" },
    { id: "SERV03", nombre: "Afeitado Imperial", cat: "Barba", precio: 8000, desc: "Afeitado tradicional con navaja.", imagen: "../imagenes/afeitado imperial.jpg" },
    { id: "SERV04", nombre: "Tratamiento Facial", cat: "Facial", precio: 15000, desc: "Limpieza profunda y mascarilla hidratante.", imagen: "../imagenes/tratamiento facial.jpe" },
    { id: "PROD01", nombre: "Pomada Modeladora", cat: "Productos", precio: 12000, desc: "Pomada de fijación fuerte aroma a sándalo.", imagen: "../imagenes/pomada modeladora.jpe" },
    { id: "PROD02", nombre: "Aceite para Barba", cat: "Productos", precio: 9000, desc: "Aceite nutritivo para hidratar el vello facial.", imagen: "../imagenes/aceite de barba.jpe" }
];

// Función para cargar el producto en la página de Detalle
function cargarDetalleProducto() {
    // Obtenemos el ID de la URL (ej: producto-detalle.html?id=SERV02)
    var params = new URLSearchParams(window.location.search);
    var productId = params.get("id");

    // Buscamos el producto en el array 'productos'
    var p = productos.find(item => item.id === productId);

    // Si no se encuentra el producto o no hay ID, usamos el primero por defecto
    if (!p) {
        p = productos[0];
    }

    document.getElementById("prod-name").innerHTML = p.nombre;
    document.getElementById("prod-category").innerHTML = p.cat;
    document.getElementById("prod-desc").innerHTML = p.desc;
    document.getElementById("prod-price").innerHTML = "$" + p.precio;

    // Manejo de la imagen del producto
    var imgElement = document.getElementById("prod-image");
    if (imgElement) {
        if (p.imagen) {
            imgElement.src = p.imagen;
            imgElement.style.display = "block";
        } else {
            imgElement.style.display = "none";
        }
    }

    // Evento para el botón de agregar al carrito
    var btnAdd = document.getElementById("add-to-cart");
    if (btnAdd) {
        btnAdd.onclick = function() {
            agregarAlCarrito(p.id, p.nombre, p.precio);
        };
    }
}

window.onload = function() {
    if (document.getElementById("prod-name")) {
        cargarDetalleProducto();
    }
};
