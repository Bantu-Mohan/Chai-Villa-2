import React, { useState } from 'react';
import OrderCard from '../LiveOrders/OrderCard';
import TableDetailModal from '../ManualOrder/ManualOrderModal';
import './TableOrderGrid.css';

function TableOrderGrid({ tables, orders, paidOrders, getUpdateHandlers }) {
    // added paidOrders prop
    const { onUpdateStatus, onCancel, onAddManualOrder, onClearOrder } = getUpdateHandlers();

    const [activeModalTableId, setActiveModalTableId] = useState(null);

    const getActiveOrder = (tableId) => {
        return orders.find(o => o.tableId === tableId && o.status !== 'archived' && o.status !== 'cancelled' && o.status !== 'completed');
    };

    // Get last paid bills for a table
    const getPaidBills = (tableId) => {
        if (!paidOrders) return [];
        // INCREASED LIMIT TO 20 allow "all previous bills" view
        return paidOrders.filter(o => o.tableId === tableId).sort((a, b) => b.paidAt - a.paidAt).slice(0, 20);
    };

    return (
        <div className="table-order-grid">
            {tables.map(tableId => {
                const activeOrder = getActiveOrder(tableId);
                const hasOrder = !!activeOrder;

                return (
                    <div
                        key={tableId}
                        id={`table-box-${tableId}`}
                        className={`table-box ${hasOrder ? 'active-table' : ''}`}
                        onClick={() => setActiveModalTableId(tableId)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="table-box-header">
                            <span>Table {tableId}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {!hasOrder && <span className="add-order-btn">+ Order</span>}
                                {hasOrder && <span className="status-badge-small">{activeOrder.status}</span>}
                            </div>
                        </div>

                        <div className="table-box-content">
                            {hasOrder ? (
                                <OrderCard
                                    order={activeOrder}
                                    onUpdateStatus={onUpdateStatus}
                                    onCancel={onCancel}
                                />
                            ) : (
                                <div className="empty-msg">
                                    <span>Empty • Tap to Add Order</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {activeModalTableId && (
                <TableDetailModal
                    isOpen={!!activeModalTableId}
                    tableId={activeModalTableId}
                    existingOrder={getActiveOrder(activeModalTableId)}
                    lastPaidOrders={getPaidBills(activeModalTableId)} // Pass Extended History
                    onClose={() => setActiveModalTableId(null)}
                    onSubmit={onAddManualOrder}
                    onUpdateStatus={onUpdateStatus}
                    onClear={onClearOrder}
                />
            )}
        </div>
    );
}

export default TableOrderGrid;
