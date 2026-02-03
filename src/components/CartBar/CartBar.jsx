import './CartBar.css';

function CartBar({ itemCount, total, onViewCart }) {
    if (itemCount === 0) return null;

    return (
        <div className="cart-bar" onClick={onViewCart}>
            <div className="cart-info">
                <span className="cart-count">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
                <span className="cart-dot">·</span>
                <span className="cart-total">₹{total}</span>
            </div>
            <button className="view-cart-btn">
                View Cart
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
}

export default CartBar;
