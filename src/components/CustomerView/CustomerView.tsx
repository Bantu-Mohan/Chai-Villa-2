import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { MENU_ITEMS, MENU_CATEGORIES, type MenuCategory } from '../../data/menu';
import styles from './CustomerView.module.css';

interface Props {
    tableId: string;
}

const CustomerView: React.FC<Props> = ({ tableId }) => {
    const { state, dispatch } = useApp();
    const table = state.tables[tableId];

    const [activeCategory, setActiveCategory] = useState<MenuCategory>('Milk Tea');

    // If table doesn't exist (e.g. invalid ID), show error
    if (!table) {
        return <div className={styles.stateView}>Invalid Table ID</div>;
    }

    // Filter menu
    const filteredMenu = useMemo(() => {
        return MENU_ITEMS.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    // Handlers
    const handleAddItem = (item: typeof MENU_ITEMS[number]) => {
        if (table.status === 'ORDERED' || table.status === 'PREPARING' || table.status === 'SERVED') return; // Locked

        dispatch({
            type: 'ADD_ITEM',
            payload: {
                tableId,
                item: { ...item, qty: 1 }
            }
        });
    };

    const handleUpdateQty = (itemId: string, currentQty: number, delta: number) => {
        if (table.status === 'ORDERED' || table.status === 'PREPARING' || table.status === 'SERVED') return; // Locked

        dispatch({
            type: 'UPDATE_ITEM_QTY',
            payload: { tableId, itemId, qty: currentQty + delta }
        });
    };

    const handlePlaceOrder = () => {
        if (table.items.length === 0) return;
        dispatch({
            type: 'UPDATE_TABLE_STATUS',
            payload: { tableId, status: 'ORDERED' }
        });
    };

    // --- RENDER STATES ---

    // 1. Pending/Locked State (Customer placed order, waiting for staff)
    if (table.status === 'ORDERED' || table.status === 'PREPARING' || table.status === 'SERVED') {
        const isServed = table.status === 'SERVED';
        return (
            <div className={styles.stateView}>
                {isServed ? (
                    <>
                        <div className={styles.successIcon}>✅</div>
                        <h2>Order Served!</h2>
                        <p style={{ color: '#888', marginTop: 10 }}>Enjoy your refreshments.</p>
                        <div className={styles.cartSummary} style={{ marginTop: 20 }}>
                            Please pay at the counter to place a new order.
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.pulse} />
                        <h2>Order Placed</h2>
                        <p style={{ color: '#888', marginTop: 10 }}>Calculating estimated time...</p>
                        <p style={{ fontSize: '0.9rem', marginTop: 20, opacity: 0.7 }}>
                            You cannot change items while order is being prepared.
                        </p>
                    </>
                )}

                {/* Show current bill even in locked state */}
                <div style={{ marginTop: 40, width: '100%', maxWidth: 400, background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 12 }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 10, marginBottom: 10 }}>Current Bill</h3>
                    {table.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.95rem' }}>
                            <span>{item.qty} x {item.name}</span>
                            <span>₹{item.price * item.qty}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span>₹{table.amount}</span>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Confirmed State (Staff cleared table) -> Auto resets to Menu Mode essentially, 
    // but if we want a "Thanks for visiting" screen we could check previous state.
    // For now, strict requirements say "Table resets -> Customer UI auto-resets to menu".
    // So if status is EMPTY (after Pay -> Clear), we show Menu.

    // 3. Menu Mode
    const totalQty = table.items.reduce((acc, i) => acc + i.qty, 0);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <h1>{state.shop.name}</h1>
                </div>
                <div className={styles.tableBadge}>
                    Table {tableId}
                </div>
            </header>

            <div className={styles.categories}>
                {MENU_CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.tab} ${activeCategory === cat ? styles.active : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.menuList}>
                {filteredMenu.map(item => {
                    const cartItem = table.items.find(i => i.id === item.id);
                    const qty = cartItem ? cartItem.qty : 0;

                    return (
                        <div key={item.id} className={styles.menuItem}>
                            <div className={styles.itemInfo}>
                                <h3>{item.name}</h3>
                                <div className={styles.price}>₹{item.price}</div>
                            </div>
                            <div className={styles.controls}>
                                {qty === 0 ? (
                                    <button
                                        onClick={() => handleAddItem(item)}
                                        style={{ width: 'auto', padding: '0 12px', fontSize: '0.9rem' }}
                                    >
                                        ADD
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => handleUpdateQty(item.id, qty, -1)}>−</button>
                                        <div className={styles.qty}>{qty}</div>
                                        <button onClick={() => handleUpdateQty(item.id, qty, 1)}>+</button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sticky Cart */}
            {totalQty > 0 && (
                <div className={styles.cartBar}>
                    <div className={styles.cartSummary}>
                        <span>{totalQty} items selected</span>
                        <div className={styles.total}>Total: ₹{table.amount}</div>
                    </div>
                    <button
                        className={styles.placeBtn}
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerView;
