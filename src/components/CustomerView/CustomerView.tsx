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
    const [showCart, setShowCart] = useState(false);

    const [activeCategory, setActiveCategory] = useState<MenuCategory>('Milk Tea');
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('chai-shop-theme');
        return (saved as Theme) || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('chai-shop-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

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

    const filteredMenu = useMemo(() => {
        return MENU_ITEMS.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    const handleAddItem = (item: typeof MENU_ITEMS[number]) => {
        if (table.status === 'ORDERED' || table.status === 'PREPARING' || table.status === 'SERVED') return;
        dispatch({
            type: 'ADD_ITEM',
            payload: { tableId, item: { ...item, qty: 1 } }
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
        setShowCart(false);
    };

    // Locked state render
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
                            <button className={styles.themeToggle} onClick={toggleTheme}>
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
                            </>
                        ) : (
                            <>
                                <div className={styles.pulse} />
                                <h2>Order Placed</h2>
                                <p className={styles.stateMuted}>Your order is being prepared...</p>
                            </>
                        )}

                        <div className={styles.billCard}>
                            <h3 className={styles.billTitle}>Your Order</h3>
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
                        <button className={styles.themeToggle} onClick={toggleTheme}>
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <div className={styles.tableBadge}>Table {tableId}</div>
                    </div>
                </header>

                {/* Category Pills */}
                <div className={styles.categoryWrapper}>
                    <nav className={styles.categoryPills}>
                        {MENU_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.categoryPill} ${activeCategory === cat ? styles.activePill : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                <span className={styles.pillIcon}>
                                    {cat === 'Milk Tea' && '🍵'}
                                    {cat === 'Coffee' && '☕'}
                                    {cat === 'Special Tea' && '🧋'}
                                    {cat === 'Milk Items' && '🥛'}
                                    {cat === 'Snacks' && '🍪'}
                                </span>
                                <span className={styles.pillText}>{cat}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Menu List - Horizontal Layout: Pic | Name | Add Button */}
                <main className={styles.menuList}>
                    {filteredMenu.map(item => {
                        const cartItem = table.items.find(i => i.id === item.id);
                        const qty = cartItem ? cartItem.qty : 0;

                        return (
                            <div key={item.id} className={styles.menuRow}>
                                {/* Image */}
                                <div className={styles.rowImage}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/menu/mt1.png';
                                        }}
                                    />
                                </div>

                                {/* Name & Price */}
                                <div className={styles.rowInfo}>
                                    <h3 className={styles.rowName}>{item.name}</h3>
                                    <span className={styles.rowPrice}>₹{item.price}</span>
                                </div>

                                {/* Add Button / Qty Controls */}
                                <div className={styles.rowAction}>
                                    {qty === 0 ? (
                                        <button
                                            className={styles.addButton}
                                            onClick={() => handleAddItem(item)}
                                        >
                                            ADD
                                        </button>
                                    ) : (
                                        <div className={styles.qtyBox}>
                                            <button onClick={() => handleUpdateQty(item.id, qty, -1)}>−</button>
                                            <span>{qty}</span>
                                            <button onClick={() => handleUpdateQty(item.id, qty, 1)}>+</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </main>

                {/* Cart Popup */}
                {showCart && (
                    <div className={styles.cartOverlay} onClick={() => setShowCart(false)}>
                        <div className={styles.cartPopup} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.cartHeader}>
                                <h3>🛒 Your Cart</h3>
                                <button className={styles.cartClose} onClick={() => setShowCart(false)}>✕</button>
                            </div>
                            <div className={styles.cartItems}>
                                {table.items.length === 0 ? (
                                    <p className={styles.emptyCart}>Your cart is empty</p>
                                ) : (
                                    table.items.map(item => (
                                        <div key={item.id} className={styles.cartItem}>
                                            <div className={styles.cartItemInfo}>
                                                <span className={styles.cartItemName}>{item.name}</span>
                                                <span className={styles.cartItemPrice}>₹{item.price}</span>
                                            </div>
                                            <div className={styles.cartItemQty}>
                                                <button onClick={() => handleUpdateQty(item.id, item.qty, -1)}>−</button>
                                                <span>{item.qty}</span>
                                                <button onClick={() => handleUpdateQty(item.id, item.qty, 1)}>+</button>
                                            </div>
                                            <span className={styles.cartItemTotal}>₹{item.price * item.qty}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            {table.items.length > 0 && (
                                <div className={styles.cartFooter}>
                                    <div className={styles.cartTotal}>
                                        <span>Total</span>
                                        <span className={styles.cartTotalAmount}>₹{table.amount}</span>
                                    </div>
                                    <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>
                                        Place Order →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Floating Cart Button */}
                {totalQty > 0 && !showCart && (
                    <button className={styles.cartFab} onClick={() => setShowCart(true)}>
                        <span className={styles.fabIcon}>🛒</span>
                        <span className={styles.fabInfo}>
                            <span className={styles.fabCount}>{totalQty} items</span>
                            <span className={styles.fabTotal}>₹{table.amount}</span>
                        </span>
                        <span className={styles.fabArrow}>→</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomerView;
