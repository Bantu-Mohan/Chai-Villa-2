import React, { useMemo, useState, useEffect } from 'react';
import styles from './DashboardLayout.module.css';
import { useApp } from '../../store/AppContext';

interface Props {
    children: React.ReactNode;
}

type Theme = 'dark' | 'light';

const DashboardLayout: React.FC<Props> = ({ children }) => {
    const { state } = useApp();

    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('chai-shop-theme');
        return (saved as Theme) || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('chai-shop-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const activeTables = useMemo(() => {
        return Object.values(state.tables).filter(t => t.status !== 'EMPTY').length;
    }, [state.tables]);

    const totalRevenue = useMemo(() => {
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
                            <span className={styles.statusPill} data-status="ordered">
                                <span className={styles.pillDot}></span>
                                <span className={styles.pillLabel}>Ordered</span>
                                <b>{statusCounts.ORDERED}</b>
                            </span>
                            <span className={styles.statusPill} data-status="preparing">
                                <span className={styles.pillDot}></span>
                                <span className={styles.pillLabel}>Prep</span>
                                <b>{statusCounts.PREPARING}</b>
                            </span>
                            <span className={styles.statusPill} data-status="served">
                                <span className={styles.pillDot}></span>
                                <span className={styles.pillLabel}>Served</span>
                                <b>{statusCounts.SERVED}</b>
                            </span>
                            <span className={styles.statusPill} data-status="paid">
                                <span className={styles.pillDot}></span>
                                <span className={styles.pillLabel}>Paid</span>
                                <b>{statusCounts.PAID}</b>
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Active</span>
                            <span className={styles.statValue}>{activeTables}/{state.shop.totalTables}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Revenue</span>
                            <span className={styles.statValue}>₹{totalRevenue}</span>
                        </div>
                    </div>
                    <button
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </header>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
