import './AnimatedBackground.css';

/**
 * AnimatedBackground - Renders rotating circles and arcs
 * 
 * This component is a fixed-position layer that sits behind all content.
 * All animations are pure CSS @keyframes - no JS required.
 * 
 * Elements:
 * - 5 full circles (rings) rotating at different speeds
 * - 4 partial circles (arcs) rotating
 * - 2 pulsing glow effects
 */
function AnimatedBackground() {
    return (
        <div className="animated-background" aria-hidden="true">
            {/* Full rotating circles */}
            <div className="ring-1" />
            <div className="ring-2" />
            <div className="ring-3" />
            <div className="ring-4" />
            <div className="ring-5" />

            {/* Partial rotating arcs */}
            <div className="arc-1" />
            <div className="arc-2" />
            <div className="arc-3" />
            <div className="arc-4" />

            {/* Pulsing glows */}
            <div className="glow-1" />
            <div className="glow-2" />
        </div>
    );
}

export default AnimatedBackground;
