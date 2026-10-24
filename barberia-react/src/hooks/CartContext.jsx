import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService from '../services/storage.service';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = storageService.obtener('carrito');
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    const addToCart = (product) => {
        const currentCart = storageService.obtener('carrito') || [];
        const index = currentCart.findIndex(item => item.id === product.id);

        let newCart;
        if (index !== -1) {
            newCart = [...currentCart];
            newCart[index].cantidad += 1;
        } else {
            newCart = [...currentCart, { ...product, cantidad: 1 }];
        }

        storageService.guardar('carrito', newCart);
        setCart(newCart);
    };

    const removeFromCart = (productId) => {
        const currentCart = storageService.obtener('carrito') || [];
        const newCart = currentCart.filter(item => item.id !== productId);

        storageService.guardar('carrito', newCart);
        setCart(newCart);
    };

    const updateQuantity = (productId, amount) => {
        const currentCart = storageService.obtener('carrito') || [];
        const index = currentCart.findIndex(item => item.id === productId);

        if (index !== -1) {
            const newCart = [...currentCart];
            newCart[index].cantidad = Math.max(1, newCart[index].cantidad + amount);
            storageService.guardar('carrito', newCart);
            setCart(newCart);
        }
    };

    const clearCart = () => {
        storageService.guardar('carrito', []);
        setCart([]);
    };

    const getTotal = () => {
        return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
