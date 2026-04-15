import { useState, useEffect, memo } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = memo(({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExiting(true);
          setTimeout(onLoadingComplete, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background transition-all duration-400 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-8">
        <span className="font-heading font-bold text-2xl tracking-tight text-foreground">
          RORSCHACH
          <span className="text-primary ml-1">.</span>
        </span>

        <div className="w-32 h-px bg-border relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
