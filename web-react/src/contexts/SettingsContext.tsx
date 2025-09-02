import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { SETTINGS } from "../other/constants";
import type { TimerMode } from "../other/types.websocket";

type SettingsContextType = {
  volume: number;
  setVolume: (v: number | ((prev: number) => number)) => void;
  durationWork: number;
  setDurationWork: (v: number | ((prev: number) => number)) => void;
  durationBreak: number;
  setDurationBreak: (v: number | ((prev: number) => number)) => void;
  inverseColorsFullscreen: boolean;
  setInverseColorsFullscreen: (
    v: boolean | ((prev: boolean) => boolean)
  ) => void;
  resetSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(() => {
    const v = localStorage.getItem(SETTINGS.volume.key);
    return v !== null ? Number(v) : SETTINGS.volume.defaultValue;
  });

  const setVolume = useCallback((v: number | ((prev: number) => number)) => {
    setVolumeState((prev) => {
      const newValue = typeof v === "function" ? v(prev) : v;
      localStorage.setItem(SETTINGS.volume.key, newValue.toString());
      return newValue;
    });
  }, []);

  const [durationWork, setDurationWorkState] = useState(() => {
    const v = localStorage.getItem(SETTINGS.durationWork.key);
    return v !== null ? Number(v) : SETTINGS.durationWork.defaultValue;
  });

  const setDurationWork = useCallback(
    (v: number | ((prev: number) => number)) => {
      setDurationWorkState((prev) => {
        const newValue = typeof v === "function" ? v(prev) : v;
        localStorage.setItem(SETTINGS.durationWork.key, newValue.toString());
        return newValue;
      });
    },
    []
  );

  const [durationBreak, setDurationBreakState] = useState(() => {
    const v = localStorage.getItem(SETTINGS.durationBreak.key);
    return v !== null ? Number(v) : SETTINGS.durationBreak.defaultValue;
  });

  const setDurationBreak = useCallback(
    (v: number | ((prev: number) => number)) => {
      setDurationBreakState((prev) => {
        const newValue = typeof v === "function" ? v(prev) : v;
        localStorage.setItem(SETTINGS.durationBreak.key, newValue.toString());
        return newValue;
      });
    },
    []
  );

  const [inverseColorsFullscreen, setInverseColorsFullscreenState] = useState(
    () => {
      const v = localStorage.getItem(SETTINGS.inverseColorsFullscreen.key);
      return v !== null
        ? v === "true"
        : SETTINGS.inverseColorsFullscreen.defaultValue;
    }
  );

  const setInverseColorsFullscreen = useCallback(
    (v: boolean | ((prev: boolean) => boolean)) => {
      setInverseColorsFullscreenState((prev) => {
        const newValue = typeof v === "function" ? v(prev) : v;
        localStorage.setItem(
          SETTINGS.inverseColorsFullscreen.key,
          newValue.toString()
        );
        return newValue;
      });
    },
    []
  );

  const resetSettings = useCallback(() => {
    setVolume(SETTINGS.volume.defaultValue);
    setDurationWork(SETTINGS.durationWork.defaultValue);
    setDurationBreak(SETTINGS.durationBreak.defaultValue);
    setInverseColorsFullscreen(SETTINGS.inverseColorsFullscreen.defaultValue);
  }, [
    setVolume,
    setDurationWork,
    setDurationBreak,
    setInverseColorsFullscreen,
  ]);

  return (
    <SettingsContext.Provider
      value={{
        volume,
        setVolume,
        durationWork,
        setDurationWork,
        durationBreak,
        setDurationBreak,
        inverseColorsFullscreen,
        setInverseColorsFullscreen,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettingsContext must be inside SettingsProvider");
  }
  return ctx;
}

// TODO: refactor to not read the settings directly, we have a context for this
export function getModeDuration(mode: TimerMode) {
  switch (mode) {
    case "Break": {
      const v = localStorage.getItem(SETTINGS.durationBreak.key);
      return v !== null ? Number(v) : SETTINGS.durationBreak.defaultValue;
    }
    case "Work":
    default: {
      const v = localStorage.getItem(SETTINGS.durationWork.key);
      return v !== null ? Number(v) : SETTINGS.durationWork.defaultValue;
    }
  }
}
