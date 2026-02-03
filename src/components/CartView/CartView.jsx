import QuantityStepper from '../QuantityStepper/QuantityStepper';
import './CartView.css';

function CartView({
    tableNumber,
    cartItems,
    totalItems,
    total,
    onIncrease,
    onDecrease,
    onPlaceOrder,
    onBack
}) {
    return (
        <div className="cart-view">
            <header className="cart-header">
                <button className="back-button" onClick={onBack} aria-label="Go back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1 className="cart-title">Your Order</h1>
                <span className="cart-table">Table {tableNumber}</span>
            </header>

            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <p>Your cart is empty</p>
                    </div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-left">
                                <span className="cart-item-name">{item.name}</span>
                                <span className="cart-item-unit-price">₹{item.price} each</span>
                            </div>
                            <div className="cart-item-right">
                                <QuantityStepper
                                    quantity={item.quantity}
                                    onIncrease={() => onIncrease(item.id)}
                                    onDecrease={() => onDecrease(item.id)}
                                />
                                <span className="cart-item-total">₹{item.price * item.quantity}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <footer className="cart-footer">
                    <div className="cart-summary">
                        <div className="summary-row">
                            <span className="summary-label">Total Items</span>
                            <span className="summary-value">{totalItems}</span>
                        </div>
                        <div className="summary-row total-row">
                            <span className="summary-label">Total Cost</span>
                            <span className="summary-value total-cost">₹{total}</span>
                        </div>
                    </div>
                    <button className="confirm-order-btn" onClick={onPlaceOrder}>
                        Confirm Order
                    </button>
                </footer>
            )}
        </div>
    );
}

export default CartView;
