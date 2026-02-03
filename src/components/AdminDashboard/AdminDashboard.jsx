import React, { useState } from 'react';
import AdminBackground from '../AdminBackground/AdminBackground';
import AdminHeader from '../AdminHeader/AdminHeader';
import AdminSnapshot from '../AdminSnapshot/AdminSnapshot';
import AdminStatusBar from '../AdminStatusBar/AdminStatusBar';
import TableOrderGrid from '../TableOrderSystem/TableOrderGrid';
import AllOrdersView from '../AllOrdersView/AllOrdersView';
import OrderDetailPopup from '../AllOrdersView/OrderDetailPopup';
import useAdminData from '../../hooks/useAdminData';
import './AdminDashboard.css';

function AdminDashboard() {
    const {
        orders,
        paidOrders,
        stats,
        tables,
        updateStatus,
        cancelOrder,
        clearOrder,
        addTable,
        removeTable,
        getTableStatus,
        addManualOrder,
        clearAllPaidTables
    } = useAdminData();

    // View toggle: 'tables' or 'allOrders'
    const [currentView, setCurrentView] = useState('tables');

    // For order detail popup from All Orders view
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    // Clear all paid tables
    const handleClearAllPaidTables = async () => {
        const paidTableOrders = orders.filter(o => o.status === 'paid');
        for (const order of paidTableOrders) {
            await clearOrder(order.id);
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminHeader
                currentView={currentView}
                onViewChange={setCurrentView}
            />

            {/* New Admin Status Bar - below header */}
            {currentView === 'tables' && (
                <AdminStatusBar
                    orders={orders}
                    tables={tables}
                    onAddTable={addTable}
                    onRemoveTable={removeTable}
                />
            )}

            {currentView === 'tables' && (
                <div className="dashboard-content">
                    <TableOrderGrid
                        tables={tables}
                        orders={orders}
                        paidOrders={paidOrders}
                        getUpdateHandlers={() => ({
                            onUpdateStatus: updateStatus,
                            onCancel: cancelOrder,
                            onAddManualOrder: addManualOrder,
                            onClearOrder: clearOrder
                        })}
                    />
                </div>
            )}

            {currentView === 'allOrders' && (
                <div className="dashboard-content all-orders-mode">
                    <AllOrdersView
                        orders={orders}
                        paidOrders={paidOrders}
                        onUpdateStatus={updateStatus}
                        onClear={clearOrder}
                        onOrderClick={handleOrderClick}
                    />
                </div>
            )}

            <AdminSnapshot
                stats={stats}
                orders={orders}
                paidOrders={paidOrders}
                currentView={currentView}
                onViewChange={setCurrentView}
            />
            <AdminBackground />

            {/* Simple Order Detail Popup for All Orders view */}
            {selectedOrder && (
                <OrderDetailPopup
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

export default AdminDashboard;
