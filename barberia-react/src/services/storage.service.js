const keys = {
    carrito: 'cart',
    productos: 'admin_productos',
    sesionActiva: 'sesion_activa',
    rolActiva: 'rol_activa',
    mensajes: 'mensajes_contacto',
    usuarios: 'usuarios',
    ultimoRecibo: 'ultimo_recibo',
    citas_agenda: 'citas_agenda'
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

    // --- GESTIÓN DE CITAS ---
    obtenerCitas() {
        return this.obtener('citas_agenda') || [];
    },

    guardarCita(cita) {
        const citas = this.obtenerCitas();
        citas.push(cita);
        this.guardar('citas_agenda', citas);
    },

    limpiarAgenda() {
        localStorage.removeItem('citas_agenda');
    },

    inicializarDatos() {
        // 1. Inicializar Productos
        if (!this.obtener('productos')) {
            const productosIniciales = [
                {
                    id: 101,
                    nombre: 'Corte Clásico',
                    precio: 15000,
                    stock: 'Ilimitado',
                    categoria: 'Cortes',
                    imagen: '/imagenes/corte clasico.jpe'
                },
                {
                    id: 102,
                    nombre: 'Barba Completa',
                    precio: 12000,
                    stock: 'Ilimitado',
                    categoria: 'Barba',
                    imagen: '/imagenes/Barba completa.jpe'
                },
                {
                    id: 103,
                    nombre: 'Combo Elegance',
                    precio: 22000,
                    stock: 'Ilimitado',
                    categoria: 'Combos',
                    descripcion: 'Incluye: 1. Pulido de la barba a elección, 2. Corte de cabello incluido y masajes faciales.',
                    imagen: '/imagenes/afeitadi imperial.jpg'
                },
                {
                    id: 104,
                    nombre: 'Cera Modeladora',
                    precio: 8000,
                    stock: 0,
                    categoria: 'Productos',
                    imagen: '/imagenes/pomada modeladora.jpe'
                }
            ];
            this.guardar('productos', productosIniciales);
        }

        // 2. Migración de Productos (Stock Ilimitado para servicios)
        let productos = this.obtener('productos') || [];
        let huboCambiosProd = false;
        productos = productos.map(p => {
            if (p.categoria !== 'Productos' && p.stock !== 'Ilimitado') {
                huboCambiosProd = true;
                return { ...p, stock: 'Ilimitado' };
            }
            return p;
        });
        if (huboCambiosProd) {
            this.guardar('productos', productos);
        }

        // 3. Migración de Roles (User -> Cliente)
        let usuarios = this.obtener('usuarios') || [];
        let huboCambiosUser = false;
        usuarios = usuarios.map(u => {
            if (u.rol === 'User') {
                huboCambiosUser = true;
                return { ...u, rol: 'Cliente' };
            }
            return u;
        });
        if (huboCambiosUser) {
            this.guardar('usuarios', usuarios);
        }

        // 4. Inicializar Usuarios si no existen
        if (!this.obtener('usuarios')) {
            const usuariosIniciales = [
                { email: 'admin@gmail.com', rut: '12345678-9', rol: 'Administrator', password: 'admin123' },
            ];
            this.guardar('usuarios', usuariosIniciales);
        }

        // 5. Carga Inicial de Agenda (Para pruebas)
        const citasGuardadas = this.obtener('citas_agenda');
        if (!citasGuardadas || citasGuardadas.length === 0) {
            const citasIniciales = [
                {
                    cliente: 'Juan Pérez',
                    fecha: '2026-11-01',
                    hora: '10:00',
                    servicios: ['Corte Clásico', 'Barba Completa'],
                    notas: 'Prefiere corte degradado'
                },
                {
                    cliente: 'Carlos Ruiz',
                    fecha: '2026-11-01',
                    hora: '11:30',
                    servicios: ['Combo Elegance'],
                    notas: 'Cita de cumpleaños'
                },
                {
                    cliente: 'Andrés Soto',
                    fecha: '2026-11-02',
                    hora: '15:00',
                    servicios: ['Corte Clásico'],
                    notas: 'Llegará 5 min tarde'
                }
            ];
            this.guardar('citas_agenda', citasIniciales);
        }
    },

    actualizarStock(productoId, cantidad) {
        const productos = this.obtener('productos') || [];
        const index = productos.findIndex(p => p.id === productoId);
        if (index !== -1) {
            if (productos[index].categoria === 'Productos') {
                productos[index].stock -= cantidad;
                if (productos[index].stock < 0) productos[index].stock = 0;
                this.guardar('productos', productos);
            }
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
