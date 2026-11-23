import api from './api';

/**
 * Funciones que consumen cada endpoint de la API REST (/api/v1).
 * Cada una devuelve directamente el cuerpo (data) de la respuesta.
 */
const data = (promise) => promise.then((r) => r.data);

export const authApi = {
    login: (email, password) => data(api.post('/auth/login', { email, password })),
    register: (usuario) => data(api.post('/auth/register', usuario)),
    me: () => data(api.get('/auth/me')),
};

export const productosApi = {
    listar: (categoriaId) => data(api.get('/productos', { params: { categoriaId } })),
    obtener: (id) => data(api.get(`/productos/${id}`)),
    crear: (producto) => data(api.post('/productos', producto)),
    actualizar: (id, producto) => data(api.put(`/productos/${id}`, producto)),
    eliminar: (id) => data(api.delete(`/productos/${id}`)),
};

export const categoriasApi = {
    listar: () => data(api.get('/categorias')),
    crear: (categoria) => data(api.post('/categorias', categoria)),
    actualizar: (id, categoria) => data(api.put(`/categorias/${id}`, categoria)),
    eliminar: (id) => data(api.delete(`/categorias/${id}`)),
};

export const boletasApi = {
    crear: (boleta) => data(api.post('/boletas', boleta)),
    listar: () => data(api.get('/boletas')),
    misBoletas: () => data(api.get('/boletas/mis-boletas')),
    obtener: (id) => data(api.get(`/boletas/${id}`)),
    cambiarEstado: (id, estado) => data(api.patch(`/boletas/${id}/estado`, { estado })),
    eliminar: (id) => data(api.delete(`/boletas/${id}`)),
};

export const citasApi = {
    disponibilidad: (fecha) => data(api.get('/citas/disponibilidad', { params: { fecha } })),
    crear: (cita) => data(api.post('/citas', cita)),
    misCitas: () => data(api.get('/citas/mis-citas')),
    listar: (fecha) => data(api.get('/citas', { params: { fecha } })),
    eliminar: (id) => data(api.delete(`/citas/${id}`)),
};

export const mensajesApi = {
    enviar: (mensaje) => data(api.post('/mensajes', mensaje)),
    listar: () => data(api.get('/mensajes')),
    marcarLeido: (id, leido = true) => data(api.patch(`/mensajes/${id}/leido`, null, { params: { leido } })),
    eliminar: (id) => data(api.delete(`/mensajes/${id}`)),
    vaciar: () => data(api.delete('/mensajes')),
};

export const usuariosApi = {
    listar: () => data(api.get('/usuarios')),
    crear: (usuario) => data(api.post('/usuarios', usuario)),
    actualizar: (id, usuario) => data(api.put(`/usuarios/${id}`, usuario)),
    cambiarRol: (id, rol) => data(api.patch(`/usuarios/${id}/rol`, { rol })),
    eliminar: (id) => data(api.delete(`/usuarios/${id}`)),
};

export const dashboardApi = {
    resumen: () => data(api.get('/dashboard/resumen')),
};
