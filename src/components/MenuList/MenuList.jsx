import MenuItem from '../MenuItem/MenuItem';
import './MenuList.css';

function MenuList({
    activeCategory,
    items,
    getQuantity,
    onAdd,
    onIncrease,
    onDecrease
}) {
    // Filter items to only show the active category
    const categoryItems = items.filter(item => item.category === activeCategory);

    return (
        <div className="menu-list">
            <div className="menu-items-grid">
                {categoryItems.map(item => (
                    <MenuItem
                        key={item.id}
                        item={item}
                        quantity={getQuantity(item.id)}
                        onAdd={onAdd}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                    />
                ))}
            </div>

            {categoryItems.length === 0 && (
                <div className="empty-category">
                    <p>No items in this category</p>
                </div>
            )}
        </div>
    );
}

export default MenuList;
