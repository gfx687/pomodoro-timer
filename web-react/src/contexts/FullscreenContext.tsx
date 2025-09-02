/* eslint-disable react-refresh/only-export-components */
import { createContext, use, useState, useMemo, type ReactNode } from "react";

interface FullscreenContextType {
  isTimerFullscreen: boolean;
  setIsTimerFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(
  undefined
);

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [isTimerFullscreen, setIsTimerFullscreen] = useState(false);

  const value = useMemo(
    () => ({
      isTimerFullscreen,
      setIsTimerFullscreen,
    }),
    [isTimerFullscreen]
  );

  return <FullscreenContext value={value}>{children}</FullscreenContext>;
}

export function useFullscreenContext() {
  const ctx = use(FullscreenContext);
  if (!ctx) {
    throw new Error(
      "useFullscreenContext must be used inside FullscreenProvider"
    );
  }
  return ctx;
}
