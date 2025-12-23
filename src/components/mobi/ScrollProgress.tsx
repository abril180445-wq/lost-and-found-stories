import { useScrollProgress } from "@/hooks/useParallax";

const ScrollProgress = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100]">
      <div
        className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
