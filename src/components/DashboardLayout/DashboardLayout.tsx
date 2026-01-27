import React, { useMemo } from 'react';
import styles from './DashboardLayout.module.css';
import { useApp } from '../../store/AppContext';

interface Props {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
    const { state } = useApp();

    // Calculate total revenue for the "shift" (simple definition: sum of served/paid tables? Or all tables?)
    // For now, let's just show active tables.
    const activeTables = useMemo(() => {
        return Object.values(state.tables).filter(t => t.status !== 'EMPTY').length;
    }, [state.tables]);

    const totalRevenue = useMemo(() => {
        // Very basic: Sum of amount of SERVED tables (assuming paid?)
        // Or just sum of all active orders. The prompt doesn't specify payment flow.
        // Let's sum all amounts implementation logic.
        return Object.values(state.tables).reduce((acc, t) => acc + t.amount, 0);
    }, [state.tables]);

    const statusCounts = useMemo(() => {
        const counts = { ORDERED: 0, PREPARING: 0, SERVED: 0, PAID: 0 };
        Object.values(state.tables).forEach(t => {
            if (t.status === 'ORDERED') counts.ORDERED++;
            if (t.status === 'PREPARING') counts.PREPARING++;
            if (t.status === 'SERVED') counts.SERVED++;
            if (t.status === 'PAID') counts.PAID++;
        });
        return counts;
    }, [state.tables]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.brand}>
                    <div className={styles.logoIcon}>🍵</div>
                    <div className={styles.titleGroup}>
                        <h1>{state.shop.name}</h1>
                        <div className={styles.statusBar}>
                            <span className={styles.statusPill} style={{ '--pill-color': 'var(--color-warning)' } as React.CSSProperties}>
                                Ordered: <b>{statusCounts.ORDERED}</b>
                            </span>
                            <span className={styles.statusPill} style={{ '--pill-color': 'var(--color-primary)' } as React.CSSProperties}>
                                Prep: <b>{statusCounts.PREPARING}</b>
                            </span>
                            <span className={styles.statusPill} style={{ '--pill-color': 'var(--color-success)' } as React.CSSProperties}>
                                Served: <b>{statusCounts.SERVED}</b>
                            </span>
                            <span className={styles.statusPill} style={{ '--pill-color': 'var(--color-info)' } as React.CSSProperties}>
                                Paid: <b>{statusCounts.PAID}</b>
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Active Tables</span>
                        <span className={styles.statValue}>{activeTables} / {state.shop.totalTables}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Current Revenue</span>
                        <span className={styles.statValue}>₹{totalRevenue}</span>
                    </div>
                </div>
            </header>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );

};

export default DashboardLayout;
