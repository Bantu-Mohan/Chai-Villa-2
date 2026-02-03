import React, { useState, useMemo } from 'react';
import { generateOrdersPDF } from '../../utils/pdfGenerator';
import './AllOrdersView.css';

function AllOrdersView({ orders, paidOrders, onUpdateStatus, onClear, onOrderClick }) {
    const [sortBy, setSortBy] = useState('time'); // 'time', 'status', 'table'
    const [collapsedTables, setCollapsedTables] = useState({});

    // Combine and deduplicate orders
    const allOrders = useMemo(() => {
        const combined = [...orders, ...paidOrders];
        return combined.filter((order, index, self) =>
            index === self.findIndex(o => o.id === order.id)
        );
    }, [orders, paidOrders]);

    // Sort orders
    const sortedOrders = useMemo(() => {
        const sorted = [...allOrders];

        switch (sortBy) {
            case 'time':
                return sorted.sort((a, b) => b.timestamp - a.timestamp);
            case 'status':
                const statusOrder = { 'new': 0, 'preparing': 1, 'served': 2, 'paid': 3, 'archived': 4 };
                return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            case 'table':
                return sorted.sort((a, b) => a.tableId - b.tableId || b.timestamp - a.timestamp);
            default:
                return sorted;
        }
    }, [allOrders, sortBy]);

    // Group by table if sorted by table
    const groupedOrders = useMemo(() => {
        if (sortBy !== 'table') return null;

        const groups = {};
        sortedOrders.forEach(order => {
            if (!groups[order.tableId]) {
                groups[order.tableId] = [];
            }
            groups[order.tableId].push(order);
        });
        return groups;
    }, [sortedOrders, sortBy]);

    // Calculate totals (only paid orders)
    const totals = useMemo(() => {
        const paidOnly = allOrders.filter(o => o.status === 'paid' || o.status === 'archived');
        const uniquePaid = paidOnly.filter((order, index, self) =>
            index === self.findIndex(o => o.id === order.id)
        );
        const totalRevenue = uniquePaid.reduce((sum, o) => sum + (o.total || 0), 0);
        return {
            count: uniquePaid.length,
            revenue: totalRevenue
        };
    }, [allOrders]);

    const toggleTableCollapse = (tableId) => {
        setCollapsedTables(prev => ({
            ...prev,
            [tableId]: !prev[tableId]
        }));
    };

    const getTimeElapsed = (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);

        if (hours > 0) return `${hours}h ${mins % 60}m ago`;
        if (mins > 0) return `${mins}m ago`;
        return 'Just now';
    };

    const renderOrderCard = (order) => (
        <div
            key={order.id}
            className={`ao-order-card status-${order.status}`}
            onClick={() => onOrderClick && onOrderClick(order)}
        >
            <div className="ao-order-header">
                <span className="ao-order-token">{order.token || `#${order.id}`}</span>
                <span className={`ao-status-badge ${order.status}`}>
                    {order.status.toUpperCase()}
                </span>
            </div>
            <div className="ao-order-meta">
                <span className="ao-table-num">Table {order.tableId}</span>
                <span className="ao-time">{getTimeElapsed(order.timestamp)}</span>
            </div>
            <div className="ao-order-items">
                {order.items.map((item, i) => (
                    <span key={i}>{item.qty}x {item.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                ))}
            </div>
            <div className="ao-order-total">₹{order.total}</div>
        </div>
    );

    return (
        <div className="all-orders-view">
            {/* Header with Totals */}
            <div className="ao-header">
                <div className="ao-totals">
                    <div className="ao-total-card">
                        <span className="ao-total-label">Paid Orders</span>
                        <span className="ao-total-value">{totals.count}</span>
                    </div>
                    <div className="ao-total-card">
                        <span className="ao-total-label">Total Revenue</span>
                        <span className="ao-total-value">₹{totals.revenue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Sort Controls & Action */}
            <div className="ao-controls">
                <div className="ao-controls-left">
                    <span className="ao-sort-label">Sort by:</span>
                    <div className="ao-sort-options">
                        <button
                            className={`ao-sort-btn ${sortBy === 'time' ? 'active' : ''}`}
                            onClick={() => setSortBy('time')}
                        >
                            Time
                        </button>
                        <button
                            className={`ao-sort-btn ${sortBy === 'status' ? 'active' : ''}`}
                            onClick={() => setSortBy('status')}
                        >
                            Status
                        </button>
                        <button
                            className={`ao-sort-btn ${sortBy === 'table' ? 'active' : ''}`}
                            onClick={() => setSortBy('table')}
                        >
                            Table
                        </button>
                    </div>
                </div>

                <button
                    className="ao-download-btn"
                    onClick={() => generateOrdersPDF(sortedOrders, totals)}
                >
                    Download PDF ⬇
                </button>
            </div>

            {/* Orders List */}
            <div className="ao-orders-list">
                {sortedOrders.length === 0 ? (
                    <div className="ao-no-orders">No orders yet</div>
                ) : sortBy === 'table' && groupedOrders ? (
                    // Grouped by table view
                    Object.entries(groupedOrders).map(([tableId, tableOrders]) => (
                        <div key={tableId} className="ao-table-group">
                            <div
                                className="ao-table-header"
                                onClick={() => toggleTableCollapse(tableId)}
                            >
                                <span className="ao-table-title">Table {tableId}</span>
                                <span className="ao-table-count">{tableOrders.length} orders</span>
                                <span className={`ao-collapse-icon ${collapsedTables[tableId] ? 'collapsed' : ''}`}>
                                    ▼
                                </span>
                            </div>
                            {!collapsedTables[tableId] && (
                                <div className="ao-table-orders">
                                    {tableOrders.map(renderOrderCard)}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    // Flat list view
                    sortedOrders.map(renderOrderCard)
                )}
            </div>
        </div>
    );
}

export default AllOrdersView;
