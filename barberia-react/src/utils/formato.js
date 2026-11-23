/** Utilidades de formato y validación compartidas. */

export const formatCLP = (valor) =>
    `$${Number(valor || 0).toLocaleString('es-CL')}`;

export const formatFecha = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('es-CL');
};

/** Acepta "12345678-9", "123456789" o "12.345.678-9" y devuelve "12345678-9". */
export const normalizarRut = (rut) => {
    const limpio = (rut || '').replace(/[.\s-]/g, '').toUpperCase();
    if (limpio.length < 2) return limpio;
    return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`;
};

/** Validación del dígito verificador (módulo 11), igual que en el backend. */
export const rutValido = (rut) => {
    const r = normalizarRut(rut);
    if (!/^\d{7,8}-[\dK]$/.test(r)) return false;
    const [cuerpo, dv] = r.split('-');
    let suma = 0;
    let mult = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * mult;
        mult = mult === 7 ? 2 : mult + 1;
    }
    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dv === esperado;
};

/** Nombre legible de cada rol. */
export const NOMBRE_ROL = {
    ADMIN: 'Administrador',
    VENDEDOR: 'Vendedor',
    CLIENTE: 'Cliente',
};
