import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { categoriasApi, productosApi } from '../services/barberia.api';
import { getErrorMessage } from '../services/api';

const ProductContext = createContext(null);

/**
 * Adapta la respuesta del backend al formato que usan los componentes:
 * stock "Ilimitado" para servicios y nombre de categoría como texto.
 */
export const normalizarProducto = (p) => ({
    ...p,
    categoria: p.categoria,
    stock: p.ilimitado ? 'Ilimitado' : p.stock,
});

/** Catálogo global obtenido desde GET /api/v1/productos y /categorias. */
export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([productosApi.listar(), categoriasApi.listar()]);
            setProducts(prods.map(normalizarProducto));
            setCategorias(cats);
            setError('');
        } catch (e) {
            setError(getErrorMessage(e, 'No se pudo cargar el catálogo'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <ProductContext.Provider value={{ products, categorias, loading, error, loadProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
