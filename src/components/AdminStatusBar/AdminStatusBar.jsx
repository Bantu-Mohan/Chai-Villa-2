import React, { useState, useMemo } from 'react';
import './AdminStatusBar.css';

function AdminStatusBar({ orders, tables, onAddTable, onRemoveTable }) {
    // Calculate status counts from orders
    const statusCounts = useMemo(() => {
        const counts = {
            new: 0,
            preparing: 0,
            served: 0,
            paid: 0
        };

        orders.forEach(order => {
            if (order.status === 'new') counts.new++;
            else if (order.status === 'preparing') counts.preparing++;
            else if (order.status === 'served') counts.served++;
            else if (order.status === 'paid') counts.paid++;
        });

        return counts;
    }, [orders]);

    // Calculate empty tables
    const emptyTablesCount = useMemo(() => {
        const activeTables = new Set();
        orders.forEach(order => {
            if (order.status !== 'archived' && order.status !== 'cancelled') {
                activeTables.add(order.tableId);
            }
        });
        return tables.length - activeTables.size;
    }, [orders, tables]);

    return (
        <div className="admin-status-bar">
            {/* Status Counters */}
            <div className="asb-counters">
                <div className="asb-pill new">
                    <span className="asb-count">{statusCounts.new}</span>
                    <span className="asb-label">New</span>
                </div>
                <div className="asb-pill preparing">
                    <span className="asb-count">{statusCounts.preparing}</span>
                    <span className="asb-label">Preparing</span>
                </div>
                <div className="asb-pill served">
                    <span className="asb-count">{statusCounts.served}</span>
                    <span className="asb-label">Served</span>
                </div>
                <div className="asb-pill paid">
                    <span className="asb-count">{statusCounts.paid}</span>
                    <span className="asb-label">Paid</span>
                </div>
                <div className="asb-pill empty">
                    <span className="asb-count">{emptyTablesCount}</span>
                    <span className="asb-label">Empty</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="asb-actions">
                <button
                    className="asb-action-btn remove"
                    onClick={onRemoveTable}
                    title="Remove last table"
                >
                    - Table
                </button>
                <button
                    className="asb-action-btn add"
                    onClick={onAddTable}
                    title="Add new table"
                >
                    + Table
                </button>
            </div>
        </div>
    );
}

export default AdminStatusBar;
