import React, { useState, useEffect } from 'react';
import './ManualOrderModal.css';
import menu from '../../data/menu';

function TableDetailModal({ isOpen, onClose, onSubmit, onUpdateStatus, onClear, tableId, existingOrder, lastPaidOrders }) {
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setQuantities({});
            setSearchTerm('');
            setShowHistory(false);
        }
    }, [isOpen, tableId]);

    const isPaid = existingOrder && existingOrder.status === 'paid';
    const tableState = existingOrder ? existingOrder.status : 'empty';

    const getHeaderTitle = () => {
        if (tableState === 'empty') return `Table ${tableId} – EMPTY`;
        if (isPaid) return `Table ${tableId} – PAID (Ready)`;
        return `Table ${tableId} – ${tableState.toUpperCase()}`;
    };

    const updateQty = (id, delta) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            return { ...prev, [id]: next };
        });
    };

    const newItemsTotal = menu.items.reduce((sum, item) => sum + (item.price * (quantities[item.id] || 0)), 0);
    const hasNewItems = newItemsTotal > 0;
    const grandTotal = (isPaid ? 0 : (existingOrder ? existingOrder.total : 0)) + newItemsTotal;

    const handleConfirmOrder = () => {
        const items = menu.items
            .filter(item => quantities[item.id] > 0)
            .map(item => ({ name: item.name, price: item.price, qty: quantities[item.id] }));
        onSubmit(tableId, items);
        onClose();
    };

    const setStatus = (status) => {
        if (status === 'archived') {
            onClear(existingOrder.id);
        } else {
            onUpdateStatus(existingOrder.id, status);
        }
        onClose();
    };

    const filteredItems = menu.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    // INLINE STYLES FOR COMPACT BUTTONS
    const btnStyle = {
        padding: '8px 12px', // Smaller padding
        fontSize: '0.85rem', // Smaller text
        fontWeight: '600',
        borderRadius: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        border: 'none',
        flex: 1,
        cursor: 'pointer'
    };

    return (
        <div className="manual-order-overlay" onClick={onClose}>
            <div className={`manual-order-modal`} onClick={e => e.stopPropagation()}>

                {/* HEADER */}
                <div className={`mo-header status-${tableState}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="mo-title">{getHeaderTitle()}</span>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            style={{
                                background: showHistory ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
                                color: showHistory ? 'white' : 'var(--text-primary)',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 12px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase'
                            }}
                        >
                            {showHistory ? 'Close History' : 'Last Bills'}
                        </button>
                    </div>
                    <button className="mo-close" onClick={onClose}>&times;</button>
                </div>

                {/* BODY */}
                <div className="mo-body-split">
                    {/* LEFT: MENU */}
                    <div className="mo-menu-section">
                        <div className="mo-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Add Items</span>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    border: '1px solid #ddd', padding: '4px 8px', borderRadius: '4px',
                                    fontSize: '0.8rem', outline: 'none', width: '120px', color: '#333'
                                }}
                            />
                        </div>
                        <div className="mo-menu-list">
                            {filteredItems.map(item => {
                                const qty = quantities[item.id] || 0;
                                return (
                                    <div
                                        key={item.id}
                                        className={`mo-menu-item ${qty > 0 ? 'selected' : ''}`}
                                        onClick={() => updateQty(item.id, 1)}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8em', color: 'var(--text-secondary)' }}>₹{item.price}</div>
                                        </div>
                                        {qty > 0 && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateQty(item.id, -1); }}
                                                    style={{
                                                        background: '#fff', border: '1px solid #ddd', borderRadius: '4px',
                                                        width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', color: 'red'
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{qty}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: ORDER */}
                    <div className="mo-order-section">
                        <div className="mo-section-title">
                            {showHistory ? 'Last Paid Bills (Session)' : 'Current Order'}
                        </div>

                        <div className="mo-order-list">
                            {!showHistory ? (
                                <>
                                    {isPaid && !hasNewItems && (
                                        <div style={{ padding: '10px', background: 'var(--surface)', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>Previous Bill Paid: ₹{existingOrder.total}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Order stored in History.</div>
                                        </div>
                                    )}

                                    {!isPaid && existingOrder && existingOrder.items.map((item, i) => (
                                        <div key={`ex-${i}`} className="current-order-item">
                                            <span>{item.name} <span style={{ opacity: 0.6 }}>x{item.qty}</span></span>
                                        </div>
                                    ))}

                                    {Object.keys(quantities).map(id => {
                                        const qty = quantities[id];
                                        if (!qty) return null;
                                        const item = menu.items.find(i => i.id === id);
                                        return (
                                            <div key={`new-${id}`} className="current-order-item" style={{ color: 'var(--primary)' }}>
                                                <span>+ {item.name} <span style={{ fontWeight: 800 }}>x{qty}</span></span>
                                                <span>₹{item.price * qty}</span>
                                            </div>
                                        );
                                    })}

                                    {!existingOrder && !hasNewItems && (
                                        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '10px', opacity: 0.3 }}>☕</div>
                                            <div style={{ fontStyle: 'italic' }}>No active items</div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="last-paid-section">
                                    {lastPaidOrders && lastPaidOrders.length > 0 ? (
                                        lastPaidOrders.map(order => (
                                            <div key={order.id} style={{
                                                background: 'var(--surface)',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                marginBottom: '8px',
                                                border: '1px solid var(--text-secondary)',
                                                fontSize: '0.85rem'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', color: 'var(--text-primary)' }}>
                                                    <span>₹{order.total}</span>
                                                    <span style={{ fontSize: '0.7rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                        {new Date(order.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>
                                                    {order.items.map(i => `${i.qty} ${i.name}`).join(', ')}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No recent history</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!showHistory && (
                            <div className="order-total-row">
                                <span>Total</span>
                                <span>₹{grandTotal}</span>
                            </div>
                        )}
                        {showHistory && <div className="order-total-row" style={{ opacity: 0 }}></div>}
                    </div>
                </div>

                {/* ACTIONS - UPDATED WITH COMPACT STYLES */}
                <div className="mo-footer" style={{ gap: '12px', padding: '12px' }}>

                    {tableState === 'empty' || isPaid ? (
                        <>
                            <button
                                style={{ ...btnStyle, background: hasNewItems ? 'var(--primary)' : '#ddd', color: hasNewItems ? 'white' : '#888' }}
                                disabled={!hasNewItems}
                                onClick={handleConfirmOrder}
                            >
                                {isPaid ? 'CONFIRM NEW' : 'CONFIRM ORDER'}
                            </button>

                            {isPaid && (
                                <button
                                    style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-primary)' }}
                                    onClick={() => setStatus('archived')}
                                >
                                    CLEAR TABLE
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {hasNewItems ? (
                                <button
                                    onClick={handleConfirmOrder}
                                    style={{ ...btnStyle, background: 'var(--primary)', color: 'white' }}
                                >
                                    ADD + UPDATE ORDER
                                </button>
                            ) : (
                                <>
                                    {/* 4 buttons layout still needed here? Yes, user said "in table box only 3", but popup usually has specific controls.
                                        But consistent with 3 buttons logic:
                                        Wait, popup allows manual status change. 
                                        Let's keep these but adhere to "make a little small".
                                        Actually, let's simplify active status here too if needed, but usually we want full control in modal.
                                        I will apply the compact style.
                                    */}
                                    <button style={{ ...btnStyle, background: tableState === 'new' ? 'var(--primary)' : '#eee', color: tableState === 'new' ? 'white' : '#333' }} onClick={() => setStatus('new')}>
                                        ACCEPT
                                    </button>
                                    <button style={{ ...btnStyle, background: tableState === 'preparing' ? 'var(--gold)' : '#eee', color: tableState === 'preparing' ? 'white' : '#333' }} onClick={() => setStatus('served')}>
                                        SERVED
                                    </button>
                                    <button style={{ ...btnStyle, background: tableState === 'served' ? 'var(--status-served)' : '#eee', color: tableState === 'served' ? 'white' : '#333' }} onClick={() => setStatus('paid')}>
                                        PAID
                                    </button>
                                    <button style={{ ...btnStyle, background: 'transparent', border: '1px solid #ccc' }} onClick={() => setStatus('archived')}>
                                        CLEAR
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default TableDetailModal;
