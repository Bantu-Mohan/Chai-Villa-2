import { useState, useEffect, useCallback } from 'react';

// Custom hook for managing cart state
export function useCart() {
    const [cart, setCart] = useState(() => {
        // Initialize from localStorage
        const saved = localStorage.getItem('chaiShopCart');
        return saved ? JSON.parse(saved) : {};
    });

    // Persist to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('chaiShopCart', JSON.stringify(cart));
    }, [cart]);

    // Add item to cart
    const addItem = useCallback((itemId) => {
        setCart(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    }, []);

    // Remove item from cart
    const removeItem = useCallback((itemId) => {
        setCart(prev => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) {
                newCart[itemId] = newCart[itemId] - 1;
            } else {
                delete newCart[itemId];
            }
            return newCart;
        });
    }, []);

    // Get quantity of a specific item
    const getQuantity = useCallback((itemId) => {
        return cart[itemId] || 0;
    }, [cart]);

    // Calculate total items count
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    // Calculate total price - Fixed: item IDs are strings, not numbers
    const calculateTotal = useCallback((menuItems) => {
        return Object.entries(cart).reduce((total, [itemId, qty]) => {
            const item = menuItems.find(i => i.id === itemId);
            return total + (item ? item.price * qty : 0);
        }, 0);
    }, [cart]);

    // Get cart items with details - Fixed: item IDs are strings, not numbers
    const getCartItems = useCallback((menuItems) => {
        return Object.entries(cart).map(([itemId, qty]) => {
            const item = menuItems.find(i => i.id === itemId);
            return item ? { ...item, quantity: qty } : null;
        }).filter(Boolean);
    }, [cart]);

    // Clear cart
    const clearCart = useCallback(() => {
        setCart({});
        localStorage.removeItem('chaiShopCart');
    }, []);

    return {
        cart,
        addItem,
        removeItem,
        getQuantity,
        totalItems,
        calculateTotal,
        getCartItems,
        clearCart
    };
}

export default useCart;
