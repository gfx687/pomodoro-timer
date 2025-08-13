import { createContext, useContext, useState, type ReactNode } from "react";

type FullscreenContextType = {
  isFullscreen: boolean;
  setFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void;
};

const FullscreenContext = createContext<FullscreenContextType | undefined>(
  undefined
);

export function FullscreenProvider({ children }: { children: ReactNode }) {
  const [isFullscreen, setFullscreen] = useState(false);
  return (
    <FullscreenContext.Provider value={{ isFullscreen, setFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
}

export function useFullscreen() {
  const ctx = useContext(FullscreenContext);
  if (!ctx) {
    throw new Error("useFullscreen must be used inside FullscreenProvider");
  }
  return ctx;
}
