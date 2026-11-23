import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../hooks/AuthContext';

/**
 * Protege una ruta según autenticación y rol.
 *   <ProtectedRoute>                         -> requiere sesión iniciada
 *   <ProtectedRoute roles={['ADMIN']}>        -> requiere uno de los roles indicados
 *
 * Es una restricción de interfaz: la seguridad real la aplica el backend,
 * que rechaza con 401/403 cualquier petición sin token o sin el rol adecuado.
 */
const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="warning" role="status" />
                <p className="text-secondary mt-3">Verificando sesión...</p>
            </Container>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (roles && !hasRole(...roles)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return children;
};

export default ProtectedRoute;
