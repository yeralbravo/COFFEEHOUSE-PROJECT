import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AuthContext from './AuthContext';
import { useAlerts } from '../hooks/useAlerts';
import { getCart, addItem, updateItemQuantity, removeItem, clearCart as clearCartApi } from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showErrorAlert } = useAlerts();

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            const response = await getCart();
            if (response.success) {
                setCartItems(response.data);
            }
        } catch (error) {
            showErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    }, [user, showErrorAlert]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            showErrorAlert("Debes iniciar sesión para agregar productos al carrito.");
            return false;
        }
        
        if (typeof product.stock !== 'number') {
            showErrorAlert("El producto no tiene información de stock válida. Inténtalo de nuevo.");
            return false;
        }

        if (product.stock < quantity) {
            showErrorAlert(`¡Stock insuficiente! Solo quedan ${product.stock} unidades de "${product.nombre}".`);
            return false;
        }

        try {
            const isProduct = !!product.tipo;
            await addItem(product.id, quantity, isProduct);
            await fetchCart();
            return true;
        } catch (error) {
            showErrorAlert(error.message);
            return false;
        }
    };

    const updateQuantity = async (itemId, newQuantity, isProduct) => {
        if (!user) {
            showErrorAlert("Debes iniciar sesión para modificar el carrito.");
            return;
        }
        
        if (newQuantity <= 0) {
            await removeFromCart(itemId, isProduct);
            return;
        }

        const itemToUpdate = cartItems.find(item => item.id === itemId);
        if (itemToUpdate && newQuantity > itemToUpdate.stock) {
            showErrorAlert(`¡Stock insuficiente! Solo quedan ${itemToUpdate.stock} unidades de "${itemToUpdate.nombre}".`);
            return;
        }

        try {
            await updateItemQuantity(itemId, newQuantity, isProduct);
            await fetchCart();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const removeFromCart = async (itemId, isProduct) => {
        if (!user) {
            showErrorAlert("Debes iniciar sesión para modificar el carrito.");
            return;
        }
        try {
            await removeItem(itemId, isProduct);
            await fetchCart();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const clearCart = async () => {
        if (!user) return;
        try {
            await clearCartApi();
            await fetchCart();
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.precio, 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        itemCount,
        loading
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
