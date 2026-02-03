import QuantityStepper from '../QuantityStepper/QuantityStepper';
import './MenuItem.css';

// Placeholder image component
function PlaceholderImage({ name }) {
    const initial = name.charAt(0).toUpperCase();
    return (
        <div className="menu-item-placeholder">
            <span>{initial}</span>
        </div>
    );
}

function MenuItem({ item, quantity, onAdd, onIncrease, onDecrease }) {
    return (
        <article className="menu-item">
            <div className="menu-item-image">
                {item.image ? (
                    <img src={item.image} alt={item.name} loading="lazy" />
                ) : (
                    <PlaceholderImage name={item.name} />
                )}
            </div>

            <div className="menu-item-content">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
            </div>

            <div className="menu-item-action">
                <span className="menu-item-price">₹{item.price}</span>

                {quantity === 0 ? (
                    <button className="add-button" onClick={() => onAdd(item.id)}>
                        ADD
                    </button>
                ) : (
                    <QuantityStepper
                        quantity={quantity}
                        onIncrease={() => onIncrease(item.id)}
                        onDecrease={() => onDecrease(item.id)}
                    />
                )}
            </div>
        </article>
    );
}

export default MenuItem;
