/*
   ADMIN.JS
   Lógica para la Gestión de Productos y Usuarios en el Panel Admin
*/

// --- CONTROL DE ACCESO (SISTEMA DE SEGURIDAD) ---

function verificarAccesoAdmin() {
    const { email, rol } = authService.verificarSesion();

    // Solo Administrador y Vendedor pueden entrar
    if (rol !== 'Administrator' && rol !== 'Seller') {
        alert('Acceso Denegado: No tienes permisos para entrar al Panel de Administración');
        window.location.href = '../public/login.html';
    }
}

// --- DASHBOARD METRICS ---

function cargarDashboard() {
    const productos = storageService.obtener('productos') || [];
    const usuarios = storageService.obtener('usuarios') || [];

    const totalProductos = productos.length;
    const totalUsuarios = usuarios.length;

    // Sumar todo el stock disponible
    const totalStock = productos.reduce((acc, p) => acc + (p.stock || 0), 0);

    const elProductos = document.getElementById('total-productos');
    const elUsuarios = document.getElementById('total-usuarios');
    const elStock = document.getElementById('total-stock');

    if (elProductos) elProductos.innerText = totalProductos;
    if (elUsuarios) elUsuarios.innerText = totalUsuarios;
    if (elStock) elStock.innerText = totalStock;
}

// --- GESTIÓN DE PRODUCTOS ---

function cargarProductosAdmin() {
    const productos = storageService.obtener('productos') || [];
    const tabla = document.getElementById('tablaProductos');
    if (!tabla) return;

    let html = '';
    productos.forEach((p, i) => {
        html += '<tr>' +
                '<td>' + (p.codigo || p.id) + '</td>' +
                '<td>' + p.nombre + '</td>' +
                '<td>' + p.categoria + '</td>' +
                '<td>$' + p.precio + '</td>' +
                '<td>' + p.stock + '</td>' +
                '<td>' +
                    '<button class="btn btn-outline" onclick="editarProducto(' + i + ')">Editar</button>' +
                    '<button class="btn btn-outline" style="color:red" onclick="borrarProducto(' + i + ')">Borrar</button>' +
                '</td>' +
                '</tr>';
    });
    tabla.innerHTML = html || '<tr><td colspan="6" style="text-align:center">No hay productos</td></tr>';
}

function guardarProducto(evento) {
    evento.preventDefault();

    const codigo = document.getElementById('pCodigo')?.value || '';
    const nombre = document.getElementById('pNombre')?.value || '';
    const categoria = document.getElementById('pCat')?.value || '';
    const precio = document.getElementById('pPrecio')?.value || 0;
    const stock = document.getElementById('pStock')?.value || 0;
    const desc = document.getElementById('pDesc')?.value || '';

    // Validaciones básicas
    if (nombre.length === 0) {
        alert('Error: El nombre del producto es obligatorio');
        return;
    }
    if (!validarCodigoProducto(codigo)) {
        alert('Error: El código del producto debe tener al menos 3 caracteres');
        return;
    }
    if (precio < 0 || stock < 0) {
        alert('Error: Precio y Stock no pueden ser negativos');
        return;
    }

    const productos = storageService.obtener('productos') || [];
    const form = document.getElementById('productForm');
    const index = form ? form.getAttribute('data-index') : null;

    const productoData = {
        id: index !== null ? productos[index].id : Date.now(),
        nombre,
        categoria,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        desc,
        codigo: codigo
    };

    if (index !== null) {
        productos[index] = productoData;
        form.removeAttribute('data-index');
    } else {
        productos.push(productoData);
    }

    storageService.guardar('productos', productos);
    alert('Producto guardado con éxito');
    if (form) form.reset();
    cargarProductosAdmin();
}

function editarProducto(index) {
    const productos = storageService.obtener('productos') || [];
    const p = productos[index];

    if (document.getElementById('pCodigo')) document.getElementById('pCodigo').value = p.codigo || '';
    if (document.getElementById('pNombre')) document.getElementById('pNombre').value = p.nombre;
    if (document.getElementById('pCat')) document.getElementById('pCat').value = p.categoria;
    if (document.getElementById('pPrecio')) document.getElementById('pPrecio').value = p.precio;
    if (document.getElementById('pStock')) document.getElementById('pStock').value = p.stock;
    if (document.getElementById('pDesc')) document.getElementById('pDesc').value = p.desc || '';

    const form = document.getElementById('productForm');
    if (form) form.setAttribute('data-index', index);
}

function borrarProducto(index) {
    if (confirm('¿Está seguro de borrar este producto?')) {
        const productos = storageService.obtener('productos') || [];
        productos.splice(index, 1);
        storageService.guardar('productos', productos);
        cargarProductosAdmin();
    }
}

// --- GESTIÓN de USUARIOS ---

function cargarUsuariosAdmin() {
    const usuarios = storageService.obtener('usuarios') || [];
    const tabla = document.getElementById('tablaUsuarios');
    if (!tabla) return;

    let html = '';
    usuarios.forEach((u, i) => {
        html += '<tr>' +
                '<td>' + (u.run || u.rut || 'N/A') + '</td>' +
                '<td>' + u.nombre + '</td>' +
                '<td>' + (u.apellidos || '') + '</td>' +
                '<td>' + u.email + '</td>' +
                '<td>' + u.rol + '</td>' +
                '<td>' +
                    '<button class="btn btn-outline" onclick="editarUsuario(' + i + ')">Editar</button>' +
                    '<button class="btn btn-outline" style="color:red" onclick="borrarUsuario(' + i + ')">Borrar</button>' +
                '</td>' +
                '</tr>';
    });
    tabla.innerHTML = html || '<tr><td colspan="6" style="text-align:center">No hay usuarios</td></tr>';
}

function guardarUsuario(evento) {
    evento.preventDefault();

    const run = document.getElementById('uRun').value;
    const nombre = document.getElementById('uNombre').value;
    const apellidos = document.getElementById('uApellidos').value;
    const correo = document.getElementById('uCorreo').value;
    const rol = document.getElementById('uRol').value;
    const direccion = document.getElementById('uDireccion').value;

    // --- VALIDACIONES DE USUARIO ---
    if (!validarRUN(run)) {
        alert('Error: El RUT debe contener entre 7 y 9 dígitos, sin puntos ni guiones');
        return;
    }
    if (nombre.length === 0 || nombre.length > 100) {
        alert('Error: El nombre es obligatorio y no debe exceder los 100 caracteres');
        return;
    }
    if (apellidos.length === 0 || apellidos.length > 100) {
        alert('Error: Los apellidos son obligatorios y no deben exceder los 100 caracteres');
        return;
    }
    if (!validarCorreo(correo)) {
        alert('Error: El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com');
        return;
    }

    // Asignar contraseña por defecto según rol
    let password = 'cliente123';
    if (rol === 'Administrador') password = 'admin123';
    else if (rol === 'Vendedor') password = 'seller123';

    const usuarios = storageService.obtener('usuarios') || [];
    const form = document.getElementById('userForm');
    const index = form ? form.getAttribute('data-index') : null;

    const userData = {
        run,
        nombre,
        apellidos,
        email: correo,
        rol,
        direccion,
        password
    };

    if (index !== null) {
        usuarios[index] = userData;
        form.removeAttribute('data-index');
    } else {
        usuarios.push(userData);
    }

    storageService.guardar('usuarios', usuarios);
    alert('Usuario guardado con éxito');
    if (form) form.reset();
    cargarUsuariosAdmin();
}

function editarUsuario(index) {
    const usuarios = storageService.obtener('usuarios') || [];
    const u = usuarios[index];

    document.getElementById('uRun').value = u.run || u.rut || '';
    document.getElementById('uNombre').value = u.nombre;
    document.getElementById('uApellidos').value = u.apellidos || '';
    document.getElementById('uCorreo').value = u.email || u.correo || '';
    document.getElementById('uRol').value = u.rol;
    document.getElementById('uDireccion').value = u.direccion || '';

    const form = document.getElementById('userForm');
    if (form) form.setAttribute('data-index', index);
}

function borrarUsuario(index) {
    if (confirm('¿Está seguro de borrar este usuario?')) {
        const usuarios = storageService.obtener('usuarios') || [];
        usuarios.splice(index, 1);
        storageService.guardar('usuarios', usuarios);
        cargarUsuariosAdmin();
    }
}

window.onload = function() {
    verificarAccesoAdmin();

    const formProd = document.getElementById('productForm');
    if (formProd) formProd.onsubmit = guardarProducto;

    const formUser = document.getElementById('userForm');
    if (formUser) formUser.onsubmit = guardarUsuario;

    cargarProductosAdmin();
    cargarUsuariosAdmin();
    cargarDashboard();
};
