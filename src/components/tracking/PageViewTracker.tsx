import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { track } from "@/lib/tracking";

const PageViewTracker = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    track.pageView(pathname + search);
  }, [pathname, search]);

  // Scroll depth tracking
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((window.scrollY / docHeight) * 100);
      [25, 50, 75, 100].forEach((mark) => {
        if (percent >= mark && !fired.has(mark)) {
          fired.add(mark);
          track.scrollDepth(mark);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
};

export default PageViewTracker;
