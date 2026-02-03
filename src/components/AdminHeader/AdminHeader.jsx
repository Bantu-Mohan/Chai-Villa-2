import { useState, useEffect } from 'react';
import './AdminHeader.css';

function AdminHeader({ currentView, onViewChange }) {
    const [theme, setTheme] = useState('light');
    const [soundOn, setSoundOn] = useState(true);
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Clock
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Theme Logic
    useEffect(() => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(current);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <header className="admin-header">
            {/* LEFT: Branding + Clock */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div className="admin-brand">Chai Admin</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                    {time} • OPEN
                </div>
            </div>

            {/* CENTER: View Toggle */}
            <div className="view-toggle">
                <button
                    className={`view-btn ${currentView === 'tables' ? 'active' : ''}`}
                    onClick={() => onViewChange && onViewChange('tables')}
                >
                    Tables
                </button>
                <button
                    className={`view-btn ${currentView === 'allOrders' ? 'active' : ''}`}
                    onClick={() => onViewChange && onViewChange('allOrders')}
                >
                    All Orders
                </button>
            </div>

            {/* RIGHT: Toggles */}
            <div style={{ display: 'flex', gap: '12px' }}>
                {/* Sound Toggle */}
                <button
                    className="theme-btn"
                    onClick={() => setSoundOn(!soundOn)}
                    title={soundOn ? "Mute Sounds" : "Unmute Sounds"}
                >
                    {soundOn ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                    )}
                </button>

                {/* Theme Toggle */}
                <button
                    className="theme-btn"
                    onClick={toggleTheme}
                    title="Switch Theme"
                >
                    {theme === 'light' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    )}
                </button>
            </div>
        </header>
    );
}

export default AdminHeader;
