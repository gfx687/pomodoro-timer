/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

type FullscreenContextType = {
  isTimerFullscreen: boolean;
  setIsTimerFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void;
};

const FullscreenContext = createContext<FullscreenContextType | undefined>(
  undefined
);

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [isTimerFullscreen, setIsTimerFullscreen] = useState(false);
  return (
    <FullscreenContext.Provider
      value={{
        isTimerFullscreen,
        setIsTimerFullscreen,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreenContext() {
  const ctx = useContext(FullscreenContext);
  if (!ctx) {
    throw new Error(
      "useFullscreenContext must be used inside FullscreenProvider"
    );
  }
  return ctx;
}
