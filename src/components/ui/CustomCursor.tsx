import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Track mouse coordinates
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      setIsHidden(false); // Safeguard: if mouse is moving, it is active & inside viewport
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the inner core dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    // Smoothly interpolate the outer ring (creates beautiful lag/fluid trail)
    const updateRingPosition = () => {
      const ease = 0.12; 
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
      requestAnimationFrame(updateRingPosition);
    };

    const animId = requestAnimationFrame(updateRingPosition);

    // Mouse boundaries check
    const onMouseLeave = () => setIsHidden(true);
    const onMouseEnter = () => setIsHidden(false);
    
    // Press state listeners
    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    // Window focus/blur listeners
    const onWindowBlur = () => setIsHidden(true);
    const onWindowFocus = () => setIsHidden(false);

    // Event delegation for hover state over interactive nodes
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest('button, a, input, select, textarea, form, [role="button"], canvas, [data-interactive]');
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('focus', onWindowFocus);
    window.addEventListener('mouseover', onMouseOver);

    // Global CSS flag to hide normal cursor on desktop
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      window.removeEventListener('mouseover', onMouseOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <div 
      className={`hidden lg:block pointer-events-none fixed inset-0 z-[99999] transition-opacity duration-300 ${
        isHidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Inner precise dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-cyan transition-all duration-150 ease-out shadow-[0_0_10px_rgba(0,240,255,0.8)]"
      />
      {/* Outer easing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-cyber-cyan/35 pointer-events-none transition-all duration-300 ease-out ${
          isPressed 
            ? 'w-4 h-4 bg-cyber-cyan/30 border-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)]'
            : isHovered 
              ? 'w-10 h-10 bg-cyber-cyan/5 border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.35)]' 
              : 'w-6 h-6 bg-transparent'
        }`}
      />
    </div>
  );
};
