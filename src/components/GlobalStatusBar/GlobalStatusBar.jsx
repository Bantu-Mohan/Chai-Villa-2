import React from 'react';
import './GlobalStatusBar.css';

function GlobalStatusBar({ statusCounts }) {
    // Defines the visible items
    const items = [
        { key: 'ordered', label: 'Ordered', className: 'pill-ordered' },
        { key: 'preparing', label: 'Preparing', className: 'pill-preparing' },
        { key: 'ready', label: 'Ready', className: 'pill-ready' },
        { key: 'served', label: 'Served', className: 'pill-served' },
        { key: 'paid', label: 'Paid', className: 'pill-paid' },
        { key: 'completed', label: 'Completed', className: 'pill-completed' }
    ];

    return (
        <div className="global-status-bar">
            {items.map(item => {
                const count = statusCounts[item.key] || 0;
                return (
                    <div
                        key={item.key}
                        className={`status-pill ${item.className} ${count === 0 ? 'is-zero' : ''}`}
                    >
                        <span>{item.label}</span>
                        <span className="pill-count">{count}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default GlobalStatusBar;
