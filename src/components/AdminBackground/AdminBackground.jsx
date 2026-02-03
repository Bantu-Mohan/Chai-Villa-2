import './AdminBackground.css';

/**
 * AdminBackground
 * 
 * A specialized background component for the Admin Dashboard.
 * Uses the same animation language (curved rings/arcs) as the customer view
 * but with a "Chai Shop Management" color theme (Warm Browns, Copper, Amber).
 * 
 * - Empty canvas state (background only)
 * - Layered below all content
 * - Non-interactive
 */
function AdminBackground() {
    return (
        <div className="admin-background" aria-hidden="true">
            {/* Rotating Rings */}
            <div className="admin-ring-1" />
            <div className="admin-ring-2" />
            <div className="admin-ring-3" />
            <div className="admin-ring-4" />

            {/* Curved Arcs */}
            <div className="admin-arc-1" />
            <div className="admin-arc-2" />
            <div className="admin-arc-3" />

            {/* Ambient Glows */}
            <div className="admin-glow-1" />
            <div className="admin-glow-2" />
        </div>
    );
}

export default AdminBackground;
