import { useState, useCallback, useEffect } from 'react';
import StickyHeader from '../StickyHeader/StickyHeader';
import CategoryNav from '../CategoryNav/CategoryNav';
import MenuList from '../MenuList/MenuList';
import CartBar from '../CartBar/CartBar';
import CartView from '../CartView/CartView';
import OrderConfirmation from '../OrderConfirmation/OrderConfirmation';
import menu from '../../data/menu';
import { supabase } from '../../lib/supabase';
import { useTableStatus } from '../../hooks/useTableStatus'; // IMPORT HOOK
import './OrderingPanel.css';

function OrderingPanel({ tableNumber, cart }) {
    const [view, setView] = useState('menu');
    const [activeCategory, setActiveCategory] = useState(menu.categories[0]?.id || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // REAL-TIME LOCK CHECK
    const { activeOrder, loading } = useTableStatus(tableNumber);

    // FORCE VIEW IF LOCKED
    useEffect(() => {
        if (activeOrder) {
            setView('confirmation');
        } else if (!loading && view === 'confirmation') {
            // Unlocked? Go back to menu
            setView('menu');
        }
    }, [activeOrder, loading]);

    const { addItem, removeItem, getQuantity, totalItems, calculateTotal, getCartItems, clearCart } = cart;
    const total = calculateTotal(menu.items);
    const cartItems = getCartItems(menu.items);

    const handleCategoryClick = useCallback((categoryId) => {
        setActiveCategory(categoryId);
    }, []);

    const handleViewCart = useCallback(() => {
        if (activeOrder) return; // Prevent if locked
        setView('cart');
    }, [activeOrder]);

    const handleBackToMenu = useCallback(() => {
        setView('menu');
    }, []);

    const handlePlaceOrder = async () => {
        if (!tableNumber) return;
        setIsSubmitting(true);
        const orderData = {
            table_id: tableNumber,
            items: cartItems.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
            total: total,
            status: 'new'
        };
        try {
            await supabase.from('orders').insert([orderData]);
            clearCart();
            // View update handled by Effect
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="app-loading">Loading...</div>;

    // LOCKED VIEW
    if (activeOrder) {
        return <OrderConfirmation status={activeOrder.status} />;
    }

    // STANDARD VIEW
    return (
        <div className="ordering-panel">
            {view === 'menu' && (
                <>
                    <StickyHeader
                        tableNumber={tableNumber}
                        itemCount={totalItems}
                        onCartClick={handleViewCart}
                    />
                    <CategoryNav
                        categories={menu.categories}
                        activeCategory={activeCategory}
                        onCategoryClick={handleCategoryClick}
                    />
                    <MenuList
                        activeCategory={activeCategory}
                        items={menu.items}
                        getQuantity={getQuantity}
                        onAdd={addItem}
                        onIncrease={addItem}
                        onDecrease={removeItem}
                    />
                    <CartBar
                        itemCount={totalItems}
                        total={total}
                        onViewCart={handleViewCart}
                    />
                </>
            )}

            {view === 'cart' && (
                <CartView
                    tableNumber={tableNumber}
                    cartItems={cartItems}
                    totalItems={totalItems}
                    total={total}
                    onIncrease={addItem}
                    onDecrease={removeItem}
                    onPlaceOrder={handlePlaceOrder}
                    onBack={handleBackToMenu}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}

export default OrderingPanel;
