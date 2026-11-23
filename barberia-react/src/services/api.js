import axios from 'axios';
import tokenStore from './tokenStore';

/** URL base del backend Spring Boot (configurable con VITE_API_URL en .env). */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

/** Evento global que avisa a AuthContext que la sesión ya no es válida. */
export const SESSION_EXPIRED_EVENT = 'auth:session-expired';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Cliente sin interceptores para /auth/refresh (evita bucles infinitos)
const rawClient = axios.create({ baseURL: API_URL, timeout: 10000 });

/* ---------- REQUEST: adjunta el JWT en cada petición ---------- */
api.interceptors.request.use((config) => {
    const token = tokenStore.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* ---------- Renovación del token (una sola a la vez) ---------- */
let refreshPromise = null;

export const refreshTokens = () => {
    if (!refreshPromise) {
        const refreshToken = tokenStore.getRefreshToken();
        refreshPromise = (refreshToken
            ? rawClient.post('/auth/refresh', { refreshToken })
            : Promise.reject(new Error('Sin refresh token')))
            .then(({ data }) => {
                tokenStore.setTokens(data);
                return data;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

/* ---------- RESPONSE: si el access token expiró, renueva y reintenta ---------- */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;
        const status = error.response?.status;
        const esRutaAuth = original?.url?.startsWith('/auth/login') || original?.url?.startsWith('/auth/register');

        if (status === 401 && original && !original._retry && !esRutaAuth && tokenStore.getRefreshToken()) {
            original._retry = true;
            try {
                const data = await refreshTokens();
                original.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(original);
            } catch (refreshError) {
                tokenStore.clear();
                window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

/** Extrae un mensaje legible del error devuelto por el backend (formato ApiError). */
export const getErrorMessage = (error, porDefecto = 'Ocurrió un error inesperado') => {
    if (!error?.response) {
        return error?.code === 'ECONNABORTED'
            ? 'El servidor tardó demasiado en responder'
            : 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
    }
    const data = error.response.data || {};
    if (data.campos) {
        return Object.values(data.campos).join('. ');
    }
    return data.mensaje || porDefecto;
};

export default api;
