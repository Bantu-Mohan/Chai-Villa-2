import React from 'react';
import './AdminSnapshot.css';

function AdminSnapshot({ stats, currentView, onViewChange }) {
    return (
        <div className="admin-snapshot">
            <div className="snap-card">
                <span className="snap-label">Paid Orders</span>
                <span className="snap-value">{stats.count}</span>
            </div>

            <div className="snap-card">
                <span className="snap-label">Revenue</span>
                <span className="snap-value">₹{stats.sales.toLocaleString()}</span>
            </div>

            <div className="snap-card">
                <span className="snap-label">Avg Order</span>
                <span className="snap-value">₹{stats.avg}</span>
            </div>

            {/* View Toggle Button */}
            {currentView === 'tables' && (
                <button
                    className="all-orders-btn"
                    onClick={() => onViewChange && onViewChange('allOrders')}
                >
                    View All Orders
                </button>
            )}
            {currentView === 'allOrders' && (
                <button
                    className="all-orders-btn back"
                    onClick={() => onViewChange && onViewChange('tables')}
                >
                    ← Back to Tables
                </button>
            )}
        </div>
    );
}

export default AdminSnapshot;
