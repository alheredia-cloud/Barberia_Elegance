import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import tokenStore from '../services/tokenStore';
import { refreshTokens, SESSION_EXPIRED_EVENT } from '../services/api';
import { authApi } from '../services/barberia.api';

const AuthContext = createContext(null);

/**
 * Gestión de sesión en el frontend.
 *
 * - Al iniciar sesión se guardan los tokens (access en memoria, refresh en localStorage).
 * - Al recargar la página se usa el refresh token para pedir al backend un access token nuevo
 *   y los datos del usuario: así la sesión persiste, pero el rol siempre lo confirma el servidor.
 * - Si el refresh token expiró o fue revocado, la sesión se cierra automáticamente.
 * - Cerrar sesión en una pestaña la cierra también en las demás (evento "storage").
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sessionMessage, setSessionMessage] = useState('');

    const applyAuthResponse = useCallback((data) => {
        tokenStore.setTokens(data);
        setUser(data.usuario);
        setSessionMessage('');
        return data.usuario;
    }, []);

    const clearSession = useCallback((mensaje = '') => {
        tokenStore.clear();
        setUser(null);
        setSessionMessage(mensaje);
    }, []);

    // Restaurar la sesión al cargar/recargar la aplicación
    useEffect(() => {
        let activo = true;
        if (!tokenStore.getRefreshToken()) {
            setIsLoading(false);
            return undefined;
        }
        refreshTokens()
            .then((data) => activo && setUser(data.usuario))
            .catch(() => activo && clearSession('Tu sesión expiró. Vuelve a iniciar sesión.'))
            .finally(() => activo && setIsLoading(false));
        return () => {
            activo = false;
        };
    }, [clearSession]);

    // Sesión invalidada por el interceptor de axios o cerrada en otra pestaña
    useEffect(() => {
        const onExpired = () => clearSession('Tu sesión expiró. Vuelve a iniciar sesión.');
        const onStorage = (e) => {
            if (e.key === tokenStore.REFRESH_KEY && !e.newValue) clearSession();
        };
        window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
        window.addEventListener('storage', onStorage);
        return () => {
            window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
            window.removeEventListener('storage', onStorage);
        };
    }, [clearSession]);

    const login = useCallback(
        async (email, password) => applyAuthResponse(await authApi.login(email, password)),
        [applyAuthResponse]
    );

    const register = useCallback(
        async (datos) => applyAuthResponse(await authApi.register(datos)),
        [applyAuthResponse]
    );

    const logout = useCallback(() => clearSession(), [clearSession]);

    const hasRole = useCallback((...roles) => !!user && roles.includes(user.rol), [user]);

    const value = useMemo(
        () => ({
            user,
            role: user?.rol ?? null,
            isAuthenticated: !!user,
            isLoading,
            sessionMessage,
            login,
            register,
            logout,
            hasRole,
        }),
        [user, isLoading, sessionMessage, login, register, logout, hasRole]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
