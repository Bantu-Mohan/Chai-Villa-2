import React, { useMemo } from 'react';
import './LiveOrders.css';

function OrderCard({ order, onUpdateStatus, onCancel }) {

    const timeAgo = useMemo(() => {
        const diffMs = Date.now() - order.timestamp;
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return 'Just now';
        return `${mins}m ago`;
    }, [order.timestamp]);

    const setStatus = (status) => {
        onUpdateStatus(order.id, status);
    };

    const orderTotal = order.total || 0;
    const current = order.status;

    // === PAID STATE (Minimal "Empty" Look) ===
    if (current === 'paid') {
        return (
            <div className="order-card status-paid-empty" style={{
                background: 'transparent',
                border: '2px dashed var(--primary)',
                opacity: 0.8,
                boxShadow: 'none',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
            }}>
                <div style={{
                    color: 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                }}>
                    Paid • ₹{orderTotal}
                </div>
                <div style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)'
                }}>
                    Tap to Order / Clear
                </div>
            </div>
        );
    }

    // === ACTIVE STATE ===
    return (
        <div className={`order-card status-${order.status}`}>
            <div className="receipt-header">
                <span className="receipt-table">Table {order.tableId}</span>
                <span className="receipt-time">{timeAgo}</span>
            </div>

            <hr className="receipt-divider" />

            {/* Items */}
            <div className="receipt-body">
                {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="item-row">
                        <span>
                            <span style={{ opacity: 0.5 }}>• </span>
                            {item.name} <span style={{ fontWeight: 800 }}>×{item.qty}</span>
                        </span>
                    </div>
                ))}
                {order.items.length > 4 &&
                    <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>+{order.items.length - 4} more...</div>
                }
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.85rem' }}>
                    <span>TOTAL</span> <span>₹{orderTotal}</span>
                </div>
            </div>

            {/* 3 ACTIONS ONLY (Removed 'Clear') */}
            <div className="card-actions-row">
                <button
                    className={`card-action-btn btn-new ${current === 'new' ? 'active-pulse' : 'dimmed'}`}
                    onClick={(e) => { e.stopPropagation(); setStatus('preparing'); }}
                >
                    Accept
                </button>

                <button
                    className={`card-action-btn btn-preparing ${current === 'preparing' ? 'active-pulse' : 'dimmed'}`}
                    onClick={(e) => { e.stopPropagation(); setStatus('served'); }}
                >
                    Served
                </button>

                <button
                    className={`card-action-btn btn-served ${current === 'served' ? 'active-pulse' : 'dimmed'}`}
                    onClick={(e) => { e.stopPropagation(); setStatus('paid'); }}
                >
                    Paid
                </button>
            </div>
        </div>
    );
}

export default OrderCard;
