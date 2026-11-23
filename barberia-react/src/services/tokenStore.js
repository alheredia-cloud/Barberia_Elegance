/**
 * Almacenamiento de tokens JWT.
 *
 * - accessToken: SOLO en memoria (variable del módulo). No queda en localStorage,
 *   por lo que un script o una extensión no puede leerlo desde el almacenamiento.
 * - refreshToken: en localStorage, para poder recuperar la sesión al recargar la página.
 *   Por sí solo no da acceso a la API: solo sirve para pedir un access token nuevo
 *   al endpoint /auth/refresh, que vuelve a validar la cuenta en el servidor.
 *
 * El rol del usuario NUNCA se lee del almacenamiento: siempre viene del servidor.
 */
const REFRESH_KEY = 'barberia_refresh_token';

let accessToken = null;

const tokenStore = {
    getAccessToken() {
        return accessToken;
    },

    getRefreshToken() {
        try {
            return localStorage.getItem(REFRESH_KEY);
        } catch {
            return null;
        }
    },

    setTokens({ accessToken: access, refreshToken }) {
        accessToken = access || null;
        try {
            if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
        } catch {
            /* almacenamiento no disponible: la sesión dura solo mientras la pestaña esté abierta */
        }
    },

    clear() {
        accessToken = null;
        try {
            localStorage.removeItem(REFRESH_KEY);
        } catch {
            /* ignorar */
        }
    },

    REFRESH_KEY,
};

/** Decodifica el payload de un JWT (sin verificar firma; la verificación la hace el backend). */
export const decodeJwt = (token) => {
    try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

/** true si el token no existe o expira dentro de los próximos `margenSeg` segundos. */
export const isTokenExpired = (token, margenSeg = 0) => {
    const payload = token ? decodeJwt(token) : null;
    if (!payload?.exp) return true;
    return payload.exp * 1000 <= Date.now() + margenSeg * 1000;
};

export default tokenStore;
