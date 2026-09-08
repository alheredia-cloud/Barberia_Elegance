/*
   ADMIN.JS
   Lógica para la Gestión de Productos y Usuarios en el Panel Admin
*/

// --- CONTROL DE ACCESO (SISTEMA DE SEGURIDAD) ---

function verificarAccesoAdmin() {
    var rolActivo = localStorage.getItem("rol_activa");

    // Solo Administrador y Vendedor pueden entrar
    if (rolActivo !== "Administrator" && rolActivo !== "Seller") {
        alert("Acceso Denegado: No tienes permisos para entrar al Panel de Administración");
        window.location.href = "../public/login.html";
    }
}

// --- GESTIÓN DE PRODUCTOS ---

function cargarProductosAdmin() {
    var productos = JSON.parse(localStorage.getItem("admin_productos")) || [];
    var tabla = document.getElementById("tablaProductos");
    if (!tabla) return;

    var html = "";
    for (var i = 0; i < productos.length; i++) {
        var p = productos[i];
        html += "<tr>" +
                "<td>" + p.codigo + "</td>" +
                "<td>" + p.nombre + "</td>" +
                "<td>" + p.categoria + "</td>" +
                "<td>$" + p.precio + "</td>" +
                "<td>" + p.stock + "</td>" +
                "<td>" +
                    "<button class='btn btn-outline' onclick='editarProducto(\" + i + "\')'>Editar</button>" +
                    "<button class='btn btn-outline' style='color:red' onclick='borrarProducto(\" + i + "\')'>Borrar</button>" +
                "</td>" +
                "</tr>";
    }
    tabla.innerHTML = html || "<tr><td colspan='6' style='text-align:center'>No hay productos</td></tr>";
}

function guardarProducto(evento) {
    evento.preventDefault();

    var codigo = document.getElementById("pCodigo").value;
    var nombre = document.getElementById("pNombre").value;
    var categoria = document.getElementById("pCat").value;
    var precio = document.getElementById("pPrecio").value;
    var stock = document.getElementById("pStock").value;
    var desc = document.getElementById("pDesc").value;

    // Validaciones según el PDF
    if (codigo.length < 3) {
        alert("Error: El código debe tener al menos 3 caracteres");
        return;
    }
    if (!validarNombreProducto(nombre)) {
        alert("Error: El nombre del producto no puede exceder los 100 caracteres");
        return;
    }
    if (!validarDescProducto(desc)) {
        alert("Error: La descripción no puede exceder los 500 caracteres");
        return;
    }
    if (precio < 0 || stock < 0) {
        alert("Error: Precio y Stock no pueden ser negativos");
        return;
    }

    var productos = JSON.parse(localStorage.getItem("admin_productos")) || [];
    var index = document.getElementById("productForm").getAttribute("data-index");

    if (index !== null) {
        productos[index] = { codigo, nombre, categoria, precio, stock, desc };
        document.getElementById("productForm").removeAttribute("data-index");
    } else {
        productos.push({ codigo, nombre, categoria, precio, stock, desc });
    }

    localStorage.setItem("admin_productos", JSON.stringify(productos));
    alert("Producto guardado con éxito");
    document.getElementById("productForm").reset();
    cargarProductosAdmin();
}

function editarProducto(index) {
    var productos = JSON.parse(localStorage.getItem("admin_productos")) || [];
    var p = productos[index];

    document.getElementById("pCodigo").value = p.codigo;
    document.getElementById("pNombre").value = p.nombre;
    document.getElementById("pCat").value = p.categoria;
    document.getElementById("pPrecio").value = p.precio;
    document.getElementById("pStock").value = p.stock;
    document.getElementById("pDesc").value = p.desc;

    document.getElementById("productForm").setAttribute("data-index", index);
}

function borrarProducto(index) {
    if (confirm("¿Está seguro de borrar este producto?")) {
        var productos = JSON.parse(localStorage.getItem("admin_productos")) || [];
        productos.splice(index, 1);
        localStorage.setItem("admin_productos", JSON.stringify(productos));
        cargarProductosAdmin();
    }
}

// --- GESTIÓN de USUARIOS ---

function cargarUsuariosAdmin() {
    var usuarios = JSON.parse(localStorage.getItem("admin_usuarios")) || [];
    var tabla = document.getElementById("tablaUsuarios");
    if (!tabla) return;

    var html = "";
    for (var i = 0; i < usuarios.length; i++) {
        var u = usuarios[i];
        html += "<tr>" +
                "<td>" + u.run + "</td>" +
                "<td>" + u.nombre + "</td>" +
                "<td>" + u.apellidos + "</td>" +
                "<td>" + u.correo + "</td>" +
                "<td>" + u.rol + "</td>" +
                "<td>" +
                    "<button class='btn btn-outline' onclick='editarUsuario(\" + i + "\')'>Editar</button>" +
                    "<button class='btn btn-outline' style='color:red' onclick='borrarUsuario(\" + i + "\')'>Borrar</button>" +
                "</td>" +
                "</tr>";
    }
    tabla.innerHTML = html || "<tr><td colspan='6' style='text-align:center'>No hay usuarios</td></tr>";
}

function guardarUsuario(evento) {
    evento.preventDefault();

    var run = document.getElementById("uRun").value;
    var nombre = document.getElementById("uNombre").value;
    var apellidos = document.getElementById("uApellidos").value;
    var correo = document.getElementById("uCorreo").value;
    var rol = document.getElementById("uRol").value;
    var direccion = document.getElementById("uDireccion").value;

    // Validación RUN (7-9 dígitos, sin puntos ni guiones) según PDF
    if (!validarRUN(run)) {
        alert("Error: El RUN debe tener entre 7 y 9 dígitos y NO contener puntos ni guiones");
        return;
    }
    if (!validarNombreUsuario(nombre)) {
        alert("Error: El nombre no puede exceder los 50 caracteres");
        return;
    }
    if (!validarApellidosUsuario(apellidos)) {
        alert("Error: Los apellidos no pueden exceder los 100 caracteres");
        return;
    }
    if (!validarDireccionUsuario(direccion)) {
        alert("Error: La dirección no puede exceder los 300 caracteres");
        return;
    }

    var usuarios = JSON.parse(localStorage.getItem("admin_usuarios")) || [];
    var index = document.getElementById("userForm").getAttribute("data-index");

    if (index !== null) {
        usuarios[index] = { run, nombre, apellidos, correo, rol, direccion };
        document.getElementById("userForm").removeAttribute("data-index");
    } else {
        usuarios.push({ run, nombre, apellidos, correo, rol, direccion });
    }

    localStorage.setItem("admin_usuarios", JSON.stringify(usuarios));
    alert("Usuario guardado con éxito");
    document.getElementById("userForm").reset();
    cargarUsuariosAdmin();
}

function editarUsuario(index) {
    var usuarios = JSON.parse(localStorage.getItem("admin_usuarios")) || [];
    var u = usuarios[index];

    document.getElementById("uRun").value = u.run;
    document.getElementById("uNombre").value = u.nombre;
    document.getElementById("uApellidos").value = u.apellidos;
    document.getElementById("uCorreo").value = u.correo;
    document.getElementById("uRol").value = u.rol;
    document.getElementById("uDireccion").value = u.direccion;

    document.getElementById("userForm").setAttribute("data-index", index);
}

function borrarUsuario(index) {
    if (confirm("¿Está seguro de borrar este usuario?")) {
        var usuarios = JSON.parse(localStorage.getItem("admin_usuarios")) || [];
        usuarios.splice(index, 1);
        localStorage.setItem("admin_usuarios", JSON.stringify(usuarios));
        cargarUsuariosAdmin();
    }
}

window.onload = function() {
    // 1. Primero verificamos si el usuario tiene permiso de entrar
    verificarAccesoAdmin();

    var formProd = document.getElementById("productForm");
    if (formProd) formProd.onsubmit = guardarProducto;

    var formUser = document.getElementById("userForm");
    if (formUser) formUser.onsubmit = guardarUsuario;

    cargarProductosAdmin();
    cargarUsuariosAdmin();
};
