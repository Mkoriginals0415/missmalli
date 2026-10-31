import { useEffect, useState } from "react";
import { useNavigation } from "@remix-run/react";

/**
 * Top Progress Indicator
 * Appears only when page navigation takes noticeable time (>120ms),
 * avoiding annoying flickers on fast or cached transitions.
 */
export function TopProgressBar() {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const isLoading = navigation.state !== "idle";

  useEffect(() => {
    let timer: any;
    let progressInterval: any;

    if (isLoading) {
      // Delay showing progress bar to prevent flashing on cached / instant page transitions (<120ms)
      timer = setTimeout(() => {
        setIsVisible(true);
        setProgress(25);

        // Smooth ease toward 85%
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 85) return prev;
            const diff = 85 - prev;
            return prev + Math.max(0.5, diff * 0.15);
          });
        }, 120);
      }, 120);
    } else if (isVisible) {
      // Complete bar to 100% and fade out
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 240);
      return () => clearTimeout(hideTimer);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isLoading, isVisible]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-plum via-brand-plum to-brand-gold shadow-[0_0_8px_rgba(184,146,58,0.6)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
