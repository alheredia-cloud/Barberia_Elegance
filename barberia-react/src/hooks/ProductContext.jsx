import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storage.service';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const loadProducts = () => {
        const data = storageService.obtener('productos') || [];
        setProducts(data);
    };

    useEffect(() => {
        loadProducts();

        // Escuchar cambios en localStorage desde otras pestañas
        const handleStorageChange = (e) => {
            if (e.key === 'admin_productos') {
                loadProducts();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateProducts = (newProducts) => {
        storageService.guardar('productos', newProducts);
        setProducts(newProducts);
    };

    return (
        <ProductContext.Provider value={{ products, loadProducts, updateProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
