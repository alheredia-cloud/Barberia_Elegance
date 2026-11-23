import { describe, it, expect, beforeEach } from 'vitest';
import tokenStore, { decodeJwt, isTokenExpired } from '../services/tokenStore';

/** Crea un JWT de prueba (sin firma válida) con el payload indicado. */
const crearToken = (payload) => {
    const b64 = (obj) => btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${b64({ alg: 'HS256' })}.${b64(payload)}.firma`;
};

describe('Gestión de tokens de sesión (tokenStore)', () => {
    beforeEach(() => {
        tokenStore.clear();
        localStorage.clear();
    });

    it('guarda el access token solo en memoria y el refresh token en localStorage', () => {
        tokenStore.setTokens({ accessToken: 'ACCESS', refreshToken: 'REFRESH' });

        expect(tokenStore.getAccessToken()).toBe('ACCESS');
        expect(tokenStore.getRefreshToken()).toBe('REFRESH');
        // El access token nunca queda persistido
        expect(Object.values({ ...localStorage })).not.toContain('ACCESS');
    });

    it('al cerrar sesión elimina ambos tokens', () => {
        tokenStore.setTokens({ accessToken: 'ACCESS', refreshToken: 'REFRESH' });
        tokenStore.clear();

        expect(tokenStore.getAccessToken()).toBeNull();
        expect(tokenStore.getRefreshToken()).toBeNull();
    });

    it('decodifica el payload del JWT', () => {
        const token = crearToken({ sub: 'admin@barberia.cl', rol: 'ADMIN' });
        expect(decodeJwt(token)).toMatchObject({ sub: 'admin@barberia.cl', rol: 'ADMIN' });
        expect(decodeJwt('token-invalido')).toBeNull();
    });

    it('detecta tokens expirados', () => {
        const ahora = Math.floor(Date.now() / 1000);
        expect(isTokenExpired(crearToken({ exp: ahora + 600 }))).toBe(false);
        expect(isTokenExpired(crearToken({ exp: ahora - 10 }))).toBe(true);
        expect(isTokenExpired(null)).toBe(true);
    });
});
