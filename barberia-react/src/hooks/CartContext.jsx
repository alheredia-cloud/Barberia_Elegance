import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'cart';

/** El carrito es estado del cliente: se guarda en localStorage hasta confirmar la compra en el backend. */
const leerCarrito = () => {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(leerCarrito);

    useEffect(() => {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch {
            /* almacenamiento no disponible */
        }
    }, [cart]);

    const addToCart = (product) => {
        setCart((actual) => {
            const existe = actual.find((item) => item.id === product.id);
            if (existe) {
                // No permite superar el stock disponible de productos físicos
                if (!product.esServicio && typeof product.stock === 'number' && existe.cantidad >= product.stock) {
                    return actual;
                }
                return actual.map((item) => (item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item));
            }
            return [...actual, { ...product, cantidad: 1 }];
        });
    };

    const removeFromCart = (productId) => setCart((actual) => actual.filter((item) => item.id !== productId));

    const updateQuantity = (productId, amount) => {
        setCart((actual) =>
            actual.map((item) => {
                if (item.id !== productId) return item;
                let cantidad = Math.max(1, item.cantidad + amount);
                if (!item.esServicio && typeof item.stock === 'number') cantidad = Math.min(cantidad, item.stock);
                return { ...item, cantidad };
            })
        );
    };

    const clearCart = () => setCart([]);

    const getTotal = () => cart.reduce((total, item) => total + item.precio * item.cantidad, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
