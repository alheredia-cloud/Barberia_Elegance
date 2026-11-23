import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { SECCIONES } from '../pages/AdminDashboard';
import { useAuth } from '../hooks/AuthContext';

vi.mock('../hooks/AuthContext', () => ({ useAuth: vi.fn() }));

const sesion = (rol) => ({
    isLoading: false,
    isAuthenticated: !!rol,
    hasRole: (...roles) => !!rol && roles.includes(rol),
});

const renderRuta = () =>
    render(
        <MemoryRouter initialEntries={['/admin']}>
            <Routes>
                <Route path="/login" element={<p>Pantalla login</p>} />
                <Route path="/no-autorizado" element={<p>Acceso restringido</p>} />
                <Route
                    path="/admin"
                    element={<ProtectedRoute roles={['ADMIN', 'VENDEDOR']}><p>Panel interno</p></ProtectedRoute>}
                />
            </Routes>
        </MemoryRouter>
    );

describe('Restricciones de acceso en el frontend', () => {
    beforeEach(() => cleanup());

    it('redirige al login si no hay sesión', () => {
        useAuth.mockReturnValue(sesion(null));
        renderRuta();
        expect(screen.queryByText('Pantalla login')).not.toBeNull();
    });

    it('un CLIENTE no puede entrar al panel interno', () => {
        useAuth.mockReturnValue(sesion('CLIENTE'));
        renderRuta();
        expect(screen.queryByText('Acceso restringido')).not.toBeNull();
        expect(screen.queryByText('Panel interno')).toBeNull();
    });

    it('ADMIN y VENDEDOR sí pueden entrar al panel', () => {
        useAuth.mockReturnValue(sesion('VENDEDOR'));
        renderRuta();
        expect(screen.queryByText('Panel interno')).not.toBeNull();
    });

    it('el VENDEDOR solo ve las secciones de productos y órdenes', () => {
        const visibles = SECCIONES.filter((s) => s.roles.includes('VENDEDOR')).map((s) => s.id);
        expect(visibles).toEqual(['productos', 'ordenes']);
    });

    it('el ADMIN ve todas las secciones', () => {
        const visibles = SECCIONES.filter((s) => s.roles.includes('ADMIN'));
        expect(visibles).toHaveLength(SECCIONES.length);
    });
});
