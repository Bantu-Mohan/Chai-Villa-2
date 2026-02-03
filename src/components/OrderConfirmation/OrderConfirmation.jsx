import { useState, useEffect } from 'react';
import './OrderConfirmation.css';

const ORDER_STATUSES = [
    { id: 'preparing', label: 'Preparing', step: 1 },
    { id: 'ready', label: 'Ready to Serve', step: 2 }, // Map 'preparing' to 'served' transition? Or just display?
    // Our DB statuses are: 'new', 'preparing', 'served', 'paid'.
    // Let's map them.
    { id: 'served', label: 'Served', step: 3 }
];

// Map DB status to Display Status
const getDisplayStatus = (dbStatus) => {
    if (dbStatus === 'new') return 'preparing';
    if (dbStatus === 'preparing') return 'ready'; // "Ready" implies cooking done? Or "Preparing"?
    // Simpler: 
    // New -> Preparing
    // Preparing -> Preparing
    // Served -> Served
    if (dbStatus === 'served') return 'served';
    return 'preparing';
};

function OrderConfirmation({ status = 'preparing' }) {
    const [showTick, setShowTick] = useState(false);

    // DB status ('new', 'preparing', 'served')
    const displayId = getDisplayStatus(status);

    // Status visual index
    const getStatusIndex = (id) => {
        if (id === 'preparing') return 0; // new/preparing
        if (id === 'ready') return 1; // Preparing halfway? Or manual trigger? Let's just use 0->2 flow.
        if (id === 'served') return 2;
        return 0;
    };

    // Correct mapping for visual flow
    // DB: New -> Preparing -> Served
    // UI: Ordered(Tick) -> Preparing(1) -> Served(2)
    // Actually, user wants "Unable to order".
    // So we just show "Order in Progress".

    const currentIndex = status === 'served' ? 2 : (status === 'preparing' ? 1 : 0);

    useEffect(() => {
        setShowTick(true);
    }, []);

    return (
        <div className="order-confirmation">
            <div className="confirmation-content">
                {/* Status-based Title */}
                <h1 className="success-title">
                    {status === 'served' ? 'Enjoy your Tea!' : 'Order Placed'}
                </h1>

                {/* Loading / Status Message */}
                <div className="loading-section">
                    <div className="loading-dots">
                        {status !== 'served' && (
                            <>
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </>
                        )}
                    </div>
                    <p className="loading-message">
                        {status === 'new' && "Waiting for confirmation..."}
                        {status === 'preparing' && "We are making your Chai..."}
                        {status === 'served' && "Order Served. Please Pay at Counter."}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="status-flow">
                    <div className={`status-step ${status === 'new' ? 'active' : 'completed'}`}>
                        <div className="status-indicator">1</div>
                        <span className="status-label">Ordered</span>
                    </div>
                    <div className={`status-connector ${status !== 'new' ? 'active' : ''}`} />

                    <div className={`status-step ${status === 'preparing' ? 'active' : (status === 'served' ? 'completed' : '')}`}>
                        <div className="status-indicator">2</div>
                        <span className="status-label">Preparing</span>
                    </div>
                    <div className={`status-connector ${status === 'served' ? 'active' : ''}`} />

                    <div className={`status-step ${status === 'served' ? 'active' : ''}`}>
                        <div className="status-indicator">3</div>
                        <span className="status-label">Served</span>
                    </div>
                </div>

                {status !== 'served' && (
                    <div style={{ marginTop: '2rem', opacity: 0.7, fontSize: '0.8rem' }}>
                        Please wait until this order is Paid to place a new one.
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderConfirmation;
