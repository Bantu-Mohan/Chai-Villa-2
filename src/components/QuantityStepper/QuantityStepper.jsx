import './QuantityStepper.css';

function QuantityStepper({ quantity, onIncrease, onDecrease }) {
    return (
        <div className="quantity-stepper">
            <button
                className="stepper-btn minus"
                onClick={onDecrease}
                aria-label="Decrease quantity"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span className="quantity-value">{quantity}</span>
            <button
                className="stepper-btn plus"
                onClick={onIncrease}
                aria-label="Increase quantity"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </div>
    );
}

export default QuantityStepper;
