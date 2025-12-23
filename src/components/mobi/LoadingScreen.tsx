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
          setTimeout(onLoadingComplete, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 blur-xl opacity-40" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-cyan-400 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-primary-foreground font-heading font-bold text-4xl">
              R
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-foreground font-heading font-bold text-xl tracking-tight">
            RORSCHACH
          </span>
          <span className="text-primary font-heading font-semibold text-base tracking-[0.3em]">
            MOTION
          </span>
        </div>

        <div className="w-40 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;
