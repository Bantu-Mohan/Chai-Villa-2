import React from 'react';
import { useApp } from '../../store/AppContext';
import styles from './OrderModal.module.css';

import { MENU_ITEMS } from '../../data/menu';


const OrderModal: React.FC = () => {
    const { state, dispatch } = useApp();
    const { activeModal, selectedTableId } = state.ui;
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [showHistory, setShowHistory] = React.useState(false);
    const [targetStatus, setTargetStatus] = React.useState<"PREPARING" | "PAID" | null>(null);

    // Manual Entry State
    const [manualName, setManualName] = React.useState('');
    const [manualPrice, setManualPrice] = React.useState('');

    const handleManualAdd = () => {
        const name = manualName.trim();
        const price = parseFloat(manualPrice);

        if (name && price > 0 && selectedTableId) {
            dispatch({
                type: 'ADD_ITEM',
                payload: {
                    tableId: selectedTableId,
                    item: {
                        id: `custom-${Date.now()}`,
                        name,
                        price,
                        qty: 1
                    }
                }
            });
            setManualName('');
            setManualPrice('');
            // Focus back to name input? Doing it via ref might be overkill, let's just clear.
        }
    };

    const table = selectedTableId ? state.tables[selectedTableId] : null;

    // Reset states when modal opens/closes or table changes
    React.useEffect(() => {
        if (activeModal !== 'ORDER') {
            setShowConfirm(false);
            setShowHistory(false);
            setTargetStatus(null);
        }
    }, [activeModal, selectedTableId]);

    if (activeModal !== 'ORDER' || !table || !selectedTableId) return null;

    const handleClose = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    // ... (handlers remain mostly same)
    const handleAddItem = (item: any) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                tableId: selectedTableId,
                item: { ...item, qty: 1 }
            }
        });
    };

    const handleUpdateQty = (itemId: string, qty: number) => {
        dispatch({
            type: 'UPDATE_ITEM_QTY',
            payload: { tableId: selectedTableId, itemId, qty }
        });
    };

    const handleChangeStatus = (status: "EMPTY" | "ORDERED" | "PREPARING" | "SERVED" | "PAID") => {
        if (table.items.length === 0) {
            alert("Please add at least one item before updating status.");
            return;
        }

        if (status === 'PAID' && table.status !== status && !showConfirm) {
            setShowConfirm(true);
            setTargetStatus(status);
            return;
        }

        dispatch({
            type: 'UPDATE_TABLE_STATUS',
            payload: { tableId: selectedTableId, status }
        });

        dispatch({ type: 'ADD_NOTIFICATION', payload: `Table ${selectedTableId} marked as ${status}` });

        if (showConfirm) setShowConfirm(false);
        if (status === 'PAID') handleClose();
    };

    const handleClear = () => {
        if (window.confirm('Clear this table? This cannot be undone.')) {
            dispatch({ type: 'CLEAR_TABLE', payload: selectedTableId });
            handleClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2>
                            {showConfirm ? (targetStatus === 'PAID' ? 'Confirm Payment' : 'Confirm Order') :
                                showHistory ? 'Paid History' :
                                    `Table ${selectedTableId} - ${table.status}`}
                        </h2>
                        {!showConfirm && !showHistory && table.lastPaid !== null && (
                            <button className={styles.historyBtn} onClick={() => setShowHistory(true)}>
                                📜 Last Paid Bills (₹{table.lastPaid})
                            </button>
                        )}
                    </div>
                    <button className={styles.closeBtn} onClick={handleClose}>&times;</button>
                </div>

                {showHistory ? (
                    <div className={styles.confirmContent}>
                        <div className={styles.confirmList}>
                            {(table.paidOrders || []).length === 0 ? (
                                <p className={styles.emptyHistory}>No bills recorded</p>
                            ) : (
                                (table.paidOrders || []).map((order, oIdx) => (
                                    <div key={`order-${oIdx}`} className={styles.historyOrder}>
                                        {order.items.map((item, iIdx) => (
                                            <div key={`hist-${oIdx}-${iIdx}`} className={styles.historyItem}>
                                                <span>{item.qty} x {item.name}</span>
                                                <span>₹{item.price * item.qty}</span>
                                            </div>
                                        ))}
                                        <div className={styles.historyOrderTotal}>
                                            Paid for order {oIdx + 1}: ₹{order.total}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className={styles.confirmTotal}>
                            <span>Grand Total Paid</span>
                            <span>₹{table.lastPaid}</span>
                        </div>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowHistory(false)}>Back to Order</button>
                        </div>
                    </div>
                ) : showConfirm ? (
                    <div className={styles.confirmContent}>
                        <div className={styles.confirmList}>
                            {table.items.map(item => (
                                <div key={item.id} className={styles.confirmItem}>
                                    <span>{item.qty} x {item.name}</span>
                                    <span>₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.confirmTotal}>
                            <span>Total Amount</span>
                            <span>₹{table.amount}</span>
                        </div>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => { setShowConfirm(false); setTargetStatus(null); }}>Back</button>
                            <button className={styles.confirmBtn} onClick={() => targetStatus && handleChangeStatus(targetStatus)}>
                                {targetStatus === 'PAID' ? 'Collect & Close' : 'Confirm & Prepare'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>
                        {/* Left: Menu */}
                        <div className={styles.menuSection}>
                            <h3>Menu</h3>
                            <div className={styles.menuGrid}>
                                {MENU_ITEMS.map(item => (
                                    <button
                                        key={item.id}
                                        className={styles.menuItem}
                                        onClick={() => handleAddItem(item)}
                                    >
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemPrice}>₹{item.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Current Order */}
                        <div className={styles.orderSection}>
                            <h3>Current Order</h3>
                            <div className={styles.orderList}>
                                {table.items.length === 0 ? (
                                    <p className={styles.emptyOrder}>No items yet</p>
                                ) : (
                                    table.items.map(item => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <div className={styles.orderInfo}>
                                                <span className={styles.orderName}>{item.name}</span>
                                                <span className={styles.orderPrice}>₹{item.price * item.qty}</span>
                                            </div>
                                            <div className={styles.controls}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.id, item.qty - 1); }}
                                                >-</button>
                                                <span>{item.qty}</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.id, item.qty + 1); }}
                                                >+</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className={styles.summary}>
                                <div className={styles.totalRow}>
                                    <span>Total</span>
                                    <span>₹{table.amount}</span>
                                </div>

                                {/* Manual Entry */}
                                <div className={styles.manualEntry}>
                                    <input
                                        type="text"
                                        placeholder="Custom Item"
                                        className={styles.manualInput}
                                        value={manualName}
                                        onChange={(e) => setManualName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                // Focus price input
                                                const priceInput = e.currentTarget.nextElementSibling as HTMLInputElement;
                                                priceInput?.focus();
                                            }
                                        }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="₹"
                                        className={styles.manualPrice}
                                        value={manualPrice}
                                        onChange={(e) => setManualPrice(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleManualAdd();
                                            }
                                        }}
                                    />
                                    <button
                                        className={styles.manualAddBtn}
                                        onClick={handleManualAdd}
                                    >+</button>
                                </div>

                                <button
                                    className={styles.confirmOrderBtn}
                                    onClick={() => {
                                        setTargetStatus('PREPARING');
                                        setShowConfirm(true);
                                    }}
                                    disabled={table.items.length === 0}
                                >
                                    Confirm Order
                                </button>
                            </div>

                            <div className={styles.actions}>
                                <div className={styles.statusActions}>
                                    <button
                                        className={table.status === 'PREPARING' ? styles.active : ''}
                                        onClick={() => handleChangeStatus('PREPARING')}
                                        disabled={table.items.length === 0}
                                        style={table.items.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    >Prepare</button>
                                    <button
                                        className={table.status === 'SERVED' ? styles.active : ''}
                                        onClick={() => handleChangeStatus('SERVED')}
                                        disabled={table.items.length === 0}
                                        style={table.items.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    >Serve</button>
                                    <button
                                        className={table.status === 'PAID' ? styles.active : ''}
                                        onClick={() => handleChangeStatus('PAID')}
                                        disabled={table.items.length === 0 && table.status !== 'PAID'} /* Allow Pay if already Paid? No, items cleared. Strict check: items>0 */
                                        style={table.items.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                    >Pay</button>
                                </div>
                                <button className={styles.clearBtn} onClick={handleClear}>Clear Table</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderModal;
