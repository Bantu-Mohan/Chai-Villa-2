import React from 'react';
import OrderCard from './OrderCard';
import './LiveOrders.css';

/**
 * LiveOrders Component
 * Scrollable list of active orders.
 */
function LiveOrders({ orders, onUpdateStatus, onCancel }) {
    return (
        <div className="live-orders">
            {orders.map(order => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                    onCancel={onCancel}
                />
            ))}

            {orders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No active orders
                </div>
            )}
        </div>
    );
}

export default LiveOrders;
