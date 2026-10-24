import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storage.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Solo carga la sesión una vez al iniciar la aplicación
        const savedUser = storageService.obtenerSimple('sesion_activa');
        const savedRole = storageService.obtenerSimple('rol_activa');

        if (savedUser && savedRole) {
            setUser(savedUser);
            setRole(savedRole);
        }
        setIsLoading(false);
    }, []);

    const login = (email, userRole) => {
        storageService.setSesion(email, userRole);
        setUser(email);
        setRole(userRole);
    };

    const logout = () => {
        // LIMPIEZA TOTAL Y RADICAL
        localStorage.removeItem('sesion_activa');
        localStorage.removeItem('rol_activa');

        setUser(null);
        setRole(null);

        // Forzamos recarga total para eliminar cualquier rastro en memoria
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
