import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
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
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Instantly position the inner core dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    // Smoothly interpolate the outer ring (creates beautiful lag/fluid trail)
    const updateRingPosition = () => {
      // Linear interpolation: ring position approaches mouse position with a delay
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

    // Hover state over interactive nodes
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('button, a, input, select, form, [role="button"], canvas');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseleave', onMouseLeave);
    document.body.addEventListener('mouseenter', onMouseEnter);
    
    // Add hover listener loop (and periodic refresh for dynamic items)
    addHoverListeners();
    const interval = setInterval(addHoverListeners, 2000);

    // Global CSS flag to hide normal cursor on desktop
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      clearInterval(interval);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, []);

  if (isHidden) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[99999]">
      {/* Inner precise dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber-cyan transition-all duration-150 ease-out shadow-[0_0_10px_rgba(0,240,255,0.8)]`}
      />
      {/* Outer easing ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-cyber-cyan/35 pointer-events-none transition-all duration-300 ease-out ${
          isHovered 
            ? 'w-10 h-10 bg-cyber-cyan/5 border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.35)]' 
            : 'w-6 h-6 bg-transparent'
        }`}
      />
    </div>
  );
};
