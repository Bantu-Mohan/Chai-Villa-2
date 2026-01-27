import React, { useEffect, useState } from 'react';
import { useApp } from '../../store/AppContext';
import type { Table, TableStatus } from '../../types';
import styles from './TableCard.module.css';

interface Props {
    id: string;
    table: Table;
}

const TableCard: React.FC<Props> = ({ id, table }) => {
    const { dispatch } = useApp();
    const [elapsed, setElapsed] = useState('');

    // Timer Effect
    useEffect(() => {
        if (!table.startedAt || table.status === 'EMPTY') {
            setElapsed('');
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.floor((now - table.startedAt!) / 1000); // seconds
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            setElapsed(`${mins}:${secs}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [table.startedAt, table.status]);

    const handleClick = () => {
        dispatch({ type: 'SELECT_TABLE', payload: id });
    };

    // Status-based class
    const getStatusClass = (status: TableStatus) => {
        switch (status) {
            case 'ORDERED': return styles.statusOrdered;
            case 'PREPARING': return styles.statusPreparing;
            case 'SERVED': return styles.statusServed;
            default: return styles.statusEmpty;
        }
    };

    return (
        <div
            className={`${styles.card} ${getStatusClass(table.status)}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <div className={styles.header}>
                <span className={styles.tableId}>Table {id}</span>
                <span className={styles.statusBadge}>{table.status}</span>
            </div>

            <div className={styles.body}>
                {table.status === 'EMPTY' ? (
                    <div className={styles.emptyState}>Tap to add order</div>
                ) : (
                    <>
                        <div className={styles.itemsList}>
                            {table.items.slice(0, 3).map(item => (
                                <div key={item.id} className={styles.previewItem}>
                                    <span>{item.qty}x {item.name}</span>
                                </div>
                            ))}
                            {table.items.length > 3 && (
                                <div className={styles.moreItems}>+ {table.items.length - 3} more</div>
                            )}
                        </div>

                        <div className={styles.footer}>
                            <div className={styles.timer}>
                                {elapsed && <span title="Time elapsed">⏱ {elapsed}</span>}
                            </div>
                            <div className={styles.amount}>
                                ₹{table.amount}
                                {table.lastPaid != null && (
                                    <div style={{ fontSize: '0.7em', color: 'var(--color-info)', marginTop: 4 }}>
                                        <div>Last Paid: ₹{table.lastPaid}</div>
                                        {table.paidOrders && table.paidOrders.length > 0 && (
                                            <div style={{ opacity: 0.8, fontSize: '0.9em' }}>
                                                {table.paidOrders.length} Bill(s) Paid
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Decorative Glow */}
            <div className={styles.glow} />
        </div>
    );
};

export default TableCard;
