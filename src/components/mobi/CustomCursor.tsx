import { useEffect, useState, useRef } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Check if device has pointer (not touch-only)
    const hasPointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasPointer) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      playGunshot();
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverableElement = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovering(isHoverableElement);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousemove', handleElementHover);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const playGunshot = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio not supported
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main crosshair */}
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Center dot */}
        <div 
          className={`absolute w-1.5 h-1.5 rounded-full bg-primary transition-transform duration-100 ${
            isClicking ? 'scale-150' : ''
          }`}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        />
        
        {/* Crosshair lines */}
        <div 
          className={`absolute w-4 h-0.5 bg-primary transition-all duration-200 ${
            isHovering ? 'w-6' : ''
          }`}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(0deg) translateX(8px)' }}
        />
        <div 
          className={`absolute w-4 h-0.5 bg-primary transition-all duration-200 ${
            isHovering ? 'w-6' : ''
          }`}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(180deg) translateX(8px)' }}
        />
        <div 
          className={`absolute w-4 h-0.5 bg-primary transition-all duration-200 ${
            isHovering ? 'w-6' : ''
          }`}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(90deg) translateX(8px)' }}
        />
        <div 
          className={`absolute w-4 h-0.5 bg-primary transition-all duration-200 ${
            isHovering ? 'w-6' : ''
          }`}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(270deg) translateX(8px)' }}
        />
        
        {/* Outer ring */}
        <div 
          className={`absolute w-8 h-8 rounded-full border border-primary/50 transition-all duration-200 ${
            isHovering ? 'w-12 h-12 border-primary' : ''
          } ${isClicking ? 'scale-75' : ''}`}
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {/* Click effect */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-primary animate-ping" />
        </div>
      )}

      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
