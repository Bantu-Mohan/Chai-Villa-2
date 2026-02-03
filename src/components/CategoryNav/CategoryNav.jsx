import { useRef, useEffect } from 'react';
import './CategoryNav.css';

function CategoryNav({ categories, activeCategory, onCategoryClick }) {
    const navRef = useRef(null);
    const pillRefs = useRef({});

    // Scroll active category into view
    useEffect(() => {
        const activePill = pillRefs.current[activeCategory];
        if (activePill && navRef.current) {
            const navRect = navRef.current.getBoundingClientRect();
            const pillRect = activePill.getBoundingClientRect();

            // Center the active pill in the nav
            const scrollLeft = activePill.offsetLeft - (navRect.width / 2) + (pillRect.width / 2);
            navRef.current.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }, [activeCategory]);

    return (
        <nav className="category-nav" ref={navRef}>
            <div className="category-pills">
                {categories.map(category => (
                    <button
                        key={category.id}
                        ref={el => pillRefs.current[category.id] = el}
                        className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => onCategoryClick(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default CategoryNav;
