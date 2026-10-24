const keys = {
    carrito: 'cart',
    productos: 'admin_productos',
    sesionActiva: 'sesion_activa',
    rolActiva: 'rol_activa',
    mensajes: 'mensajes_contacto',
    usuarios: 'usuarios',
    ultimoRecibo: 'ultimo_recibo'
};

const storageService = {
    obtener(clave) {
        const datos = localStorage.getItem(keys[clave]);
        return datos ? JSON.parse(datos) : null;
    },
    guardar(clave, datos) {
        localStorage.setItem(keys[clave], JSON.stringify(datos));
    },
    guardarSimple(clave, valor) {
        localStorage.setItem(keys[clave], valor);
    },
    obtenerSimple(clave) {
        return localStorage.getItem(keys[clave]);
    },
    inicializarDatos() {
        // Forzamos la actualización para asegurar que los nombres de archivos coincidan exactamente
        localStorage.removeItem(keys.productos);

        const productosIniciales = [
            {
                id: 1,
                nombre: 'Corte Clásico',
                precio: 10,
                stock: 100,
                categoria: 'Cortes',
                imagen: '/imagenes/corte clasico.jpe'
            },
            {
                id: 2,
                nombre: 'Barba Completa',
                precio: 8,
                stock: 50,
                categoria: 'Barba',
                imagen: '/imagenes/Barba completa.jpe'
            },
            {
                id: 3,
                nombre: 'Combo Elegance',
                precio: 15,
                stock: 30,
                categoria: 'Combos',
                imagen: '/imagenes/afeitado imperial.jpg'
            },
            {
                id: 4,
                nombre: 'Cera Modeladora',
                precio: 12,
                stock: 0,
                categoria: 'Productos',
                imagen: '/imagenes/pomada modeladora.jpe'
            }
        ];
        this.guardar('productos', productosIniciales);

        if (!this.obtener('usuarios')) {
            const usuariosIniciales = [
                { email: 'admin@gmail.com', rut: '12345678-9', rol: 'Administrator', password: 'admin123' },
            ];
            this.guardar('usuarios', usuariosIniciales);
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

export default storageService;
