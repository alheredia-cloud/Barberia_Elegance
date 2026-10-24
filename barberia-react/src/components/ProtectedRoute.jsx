import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const user = localStorage.getItem('sesion_activa');
    const role = localStorage.getItem('rol_activa');

    if (!user) {
        // Si no hay usuario, redirigir al login
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && role !== requiredRole) {
        // Si el usuario no tiene el rol necesario, redirigir al home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
