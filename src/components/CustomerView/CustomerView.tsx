import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { MENU_ITEMS, MENU_CATEGORIES, type MenuCategory } from '../../data/menu';
import styles from './CustomerView.module.css';

interface Props {
    tableId: string;
}

type Theme = 'dark' | 'light';

const CustomerView: React.FC<Props> = ({ tableId }) => {
    const { state, dispatch } = useApp();
    const table = state.tables[tableId];

    const [activeCategory, setActiveCategory] = useState<MenuCategory>('Milk Tea');
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('chai-shop-theme');
        return (saved as Theme) || 'dark';
    });

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('chai-shop-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // If table doesn't exist (e.g. invalid ID), show error
    if (!table) {
        return (
            <div className={styles.backdrop}>
                <div className={styles.popupModal}>
                    <div className={styles.stateView}>
                        <div className={styles.errorIcon}>❌</div>
                        <h2>Invalid Table</h2>
                        <p>Please scan the QR code again</p>
                    </div>
                </div>
            </div>
        );
    }

    // Filter menu
    const filteredMenu = useMemo(() => {
        return MENU_ITEMS.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    // Handlers
    const handleAddItem = (item: typeof MENU_ITEMS[number]) => {
        if (table.status === 'ORDERED' || table.status === 'PREPARING' || table.status === 'SERVED') return;

        dispatch({
            type: 'ADD_ITEM',
            payload: {
                tableId,
                item: { ...item, qty: 1 }
            }
        });
    };

    const handleUpdateQty = (itemId: string, currentQty: number, delta: number) => {
        if (table.status === 'ORDERED' || table.status === 'PREPARING' || table.status === 'SERVED') return;

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

    // 1. Pending/Locked State
    if (table.status === 'ORDERED' || table.status === 'PREPARING' || table.status === 'SERVED') {
        const isServed = table.status === 'SERVED';
        return (
            <div className={styles.backdrop}>
                <div className={styles.popupModal}>
                    <header className={styles.header}>
                        <div className={styles.brand}>
                            <span className={styles.brandIcon}>☕</span>
                            <h1>{state.shop.name}</h1>
                        </div>
                        <div className={styles.headerActions}>
                            <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <div className={styles.tableBadge}>Table {tableId}</div>
                        </div>
                    </header>

                    <div className={styles.stateView}>
                        {isServed ? (
                            <>
                                <div className={styles.successIcon}>✅</div>
                                <h2>Order Served!</h2>
                                <p className={styles.stateMuted}>Enjoy your refreshments.</p>
                                <div className={styles.stateHint}>
                                    Please pay at the counter to place a new order.
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.pulse} />
                                <h2>Order Placed</h2>
                                <p className={styles.stateMuted}>Your order is being prepared...</p>
                                <p className={styles.stateHint}>
                                    You cannot change items while order is being prepared.
                                </p>
                            </>
                        )}

                        <div className={styles.billCard}>
                            <h3 className={styles.billTitle}>Current Bill</h3>
                            <div className={styles.billItems}>
                                {table.items.map(item => (
                                    <div key={item.id} className={styles.billItem}>
                                        <span>{item.qty} × {item.name}</span>
                                        <span>₹{item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.billTotal}>
                                <span>Total</span>
                                <span className={styles.totalAmount}>₹{table.amount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Menu Mode
    const totalQty = table.items.reduce((acc, i) => acc + i.qty, 0);

    return (
        <div className={styles.backdrop}>
            <div className={styles.popupModal}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.brand}>
                        <span className={styles.brandIcon}>☕</span>
                        <h1>{state.shop.name}</h1>
                    </div>
                    <div className={styles.headerActions}>
                        <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <div className={styles.tableBadge}>Table {tableId}</div>
                    </div>
                </header>

                {/* Category Tabs */}
                <nav className={styles.categories} role="tablist" aria-label="Menu categories">
                    {MENU_CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            role="tab"
                            aria-selected={activeCategory === cat}
                            className={`${styles.tab} ${activeCategory === cat ? styles.active : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>

                {/* Menu Grid */}
                <main className={styles.menuGrid} role="tabpanel">
                    {filteredMenu.map(item => {
                        const cartItem = table.items.find(i => i.id === item.id);
                        const qty = cartItem ? cartItem.qty : 0;

                        return (
                            <article key={item.id} className={styles.menuCard}>
                                <div className={styles.cardImage}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/menu/mt1.png';
                                        }}
                                    />
                                    {qty > 0 && (
                                        <div className={styles.qtyBadge}>{qty}</div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{item.name}</h3>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.cardPrice}>₹{item.price}</span>
                                        <div className={styles.cardActions}>
                                            {qty === 0 ? (
                                                <button
                                                    className={styles.addBtn}
                                                    onClick={() => handleAddItem(item)}
                                                    aria-label={`Add ${item.name} to cart`}
                                                >
                                                    <span>+</span> Add
                                                </button>
                                            ) : (
                                                <div className={styles.qtyControls}>
                                                    <button
                                                        onClick={() => handleUpdateQty(item.id, qty, -1)}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>
                                                    <span className={styles.qtyValue}>{qty}</span>
                                                    <button
                                                        onClick={() => handleUpdateQty(item.id, qty, 1)}
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </main>

                {/* Sticky Cart Bar */}
                {totalQty > 0 && (
                    <footer className={styles.cartBar}>
                        <div className={styles.cartInfo}>
                            <div className={styles.cartItems}>
                                <span className={styles.cartIcon}>🛒</span>
                                <span>{totalQty} {totalQty === 1 ? 'item' : 'items'}</span>
                            </div>
                            <div className={styles.cartTotal}>₹{table.amount}</div>
                        </div>
                        <button
                            className={styles.placeOrderBtn}
                            onClick={handlePlaceOrder}
                            aria-label="Place order"
                        >
                            Place Order
                            <span className={styles.btnArrow}>→</span>
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default CustomerView;
