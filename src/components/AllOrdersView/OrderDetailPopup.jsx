import React from 'react';
import './OrderDetailPopup.css';

function OrderDetailPopup({ order, onClose }) {
    if (!order) return null;

    const orderTime = new Date(order.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="order-detail-overlay" onClick={onClose}>
            <div className="order-detail-popup" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="odp-header">
                    <div className="odp-table">Table {order.tableId}</div>
                    <div className="odp-time">{orderTime}</div>
                    <button className="odp-close" onClick={onClose}>×</button>
                </div>

                {/* Items List */}
                <div className="odp-items">
                    <div className="odp-items-header">
                        <span>Item</span>
                        <span>Qty</span>
                        <span>Cost</span>
                    </div>
                    {order.items.map((item, i) => (
                        <div key={i} className="odp-item-row">
                            <span className="odp-item-name">{item.name}</span>
                            <span className="odp-item-qty">×{item.qty}</span>
                            <span className="odp-item-cost">₹{item.price * item.qty}</span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="odp-total">
                    <span>Total</span>
                    <span>₹{order.total}</span>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailPopup;
