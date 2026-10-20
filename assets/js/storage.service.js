const storageService = (function() {
    const keys = {
        carrito: 'cart',
        productos: 'admin_productos',
        sesionActiva: 'sesion_activa',
        rolActiva: 'rol_activa',
        mensajes: 'mensajes_contacto',
        usuarios: 'usuarios',
        ultimoRecibo: 'ultimo_recibo'
    };

    return {
        obtener(clave) {
            const datos = localStorage.getItem(keys[clave]);
            return datos ? JSON.parse(datos) : null;
        },
        guardar(clave, datos) {
            localStorage.setItem(keys[clave], JSON.stringify(datos));
        },
        // Nuevo método para guardar datos simples (strings) sin JSON.stringify
        guardarSimple(clave, valor) {
            localStorage.setItem(keys[clave], valor);
        },
        // Nuevo método para obtener datos simples
        obtenerSimple(clave) {
            return localStorage.getItem(keys[clave]);
        },
        inicializarDatos() {
            if (!this.obtener('productos')) {
                const productosIniciales = [
                    { id: 1, nombre: 'Corte Clásico', precio: 10, stock: 100, categoria: 'Cortes' },
                    { id: 2, nombre: 'Barba Completa', precio: 8, stock: 50, categoria: 'Barba' },
                    { id: 3, nombre: 'Combo Elegance', precio: 15, stock: 30, categoria: 'Combos' },
                    { id: 4, nombre: 'Cera Modeladora', precio: 12, stock: 0, categoria: 'Productos' }
                ];
                this.guardar('productos', productosIniciales);
            }
            if (!this.obtener('usuarios')) {
                const usuariosIniciales = [
                    { email: 'admin@gmail.com', rut: '12345678-9', rol: 'Administrator', password: 'admin123' }
                ];
                this.guardar('usuarios', usuariosIniciales);
            }

            // Regla de Negocio: Acceso Inicial Administrador
            if (!localStorage.getItem('sesion_activa')) {
                localStorage.setItem('sesion_activa', 'admin@gmail.com');
                localStorage.setItem('rol_activa', 'Administrator');
            }
        },
        actualizarStock(productoId, cantidad) {
            const productos = this.obtener('productos') || [];
            const index = productos.findIndex(p => p.id === productoId);
            if (index !== -1) {
                productos[index].stock -= cantidad;
                if (productos[index].stock < 0) productos[index].stock = 0;
                this.guardar('productos', productos);
            }
        },
        agregarAlCarrito(producto) {
            const carrito = this.obtener('carrito') || [];
            const index = carrito.findIndex(item => item.id === producto.id);
            if (index !== -1) {
                carrito[index].cantidad += 1;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }
            this.guardar('carrito', carrito);
        },
        guardarMensaje(mensaje) {
            const mensajes = this.obtener('mensajes') || [];
            mensajes.push({ ...mensaje, fecha: new Date().toLocaleString() });
            this.guardar('mensajes', mensajes);
        },
        setSesion(email, rol) {
            localStorage.setItem(keys.sesionActiva, email);
            localStorage.setItem(keys.rolActiva, rol);
        },
        cerrarSesion() {
            localStorage.removeItem(keys.sesionActiva);
            localStorage.removeItem(keys.rolActiva);
        }
    };
})();