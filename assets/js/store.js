/*
   STORE.JS
   Lógica para mostrar los productos y el blog
*/

// Datos de ejemplo según el Plan (Simulación de Base de Datos)
var productos = [
    { id: "SERV01", nombre: "Corte Clásico", cat: "Cortes", precio: 10000, desc: "Corte tradicional con tijera y máquina." },
    { id: "SERV02", nombre: "Barba Completa", cat: "Barba", precio: 7000, desc: "Perfilado y recorte de barba con toalla caliente." },
    { id: "SERV03", nombre: "Afeitado Imperial", cat: "Barba", precio: 8000, desc: "Afeitado tradicional con navaja." },
    { id: "SERV04", nombre: "Tratamiento Facial", cat: "Facial", precio: 15000, desc: "Limpieza profunda y mascarilla hidratante." },
    { id: "PROD01", nombre: "Pomada Modeladora", cat: "Productos", precio: 12000, desc: "Pomada de fijación fuerte aroma a sándalo." },
    { id: "PROD02", nombre: "Aceite para Barba", cat: "Productos", precio: 9000, desc: "Aceite nutritivo para hidratar el vello facial." }
];

// Función para cargar el producto en la página de Detalle
function cargarDetalleProducto() {
    // Simulamos que obtenemos el ID por la URL (en un proyecto real usaríamos URLSearchParams)
    // Para este ejemplo simple, usaremos el primer producto por defecto
    var p = productos[0];

    document.getElementById("prod-name").innerHTML = p.nombre;
    document.getElementById("prod-category").innerHTML = p.cat;
    document.getElementById("prod-desc").innerHTML = p.desc;
    document.getElementById("prod-price").innerHTML = "$" + p.precio;

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
