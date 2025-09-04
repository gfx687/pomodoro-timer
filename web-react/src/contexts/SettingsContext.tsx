/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
  use,
  useMemo,
} from "react";
import { SETTINGS } from "../other/constants";
import throttle from "lodash/throttle";

interface SettingsContextType {
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
  fullscreenShowMode: boolean;
  setFullscreenShowMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(() => {
    const v = localStorage.getItem(SETTINGS.volume.key);
    return v !== null ? Number(v) : SETTINGS.volume.defaultValue;
  });

  const throttledVolumeSave = useMemo(
    () =>
      throttle((value: number) => {
        localStorage.setItem(SETTINGS.volume.key, value.toString());
      }, 500),
    []
  );

  const setVolume = useCallback(
    (v: number | ((prev: number) => number)) => {
      setVolumeState((prev) => {
        const newValue = typeof v === "function" ? v(prev) : v;
        throttledVolumeSave(newValue);
        return newValue;
      });
    },
    [throttledVolumeSave]
  );

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

  const [fullscreenShowMode, setFullscreenShowModeState] = useState(() => {
    const v = localStorage.getItem(SETTINGS.fullscreenShowMode.key);
    return v !== null ? v === "true" : SETTINGS.fullscreenShowMode.defaultValue;
  });

  const setFullscreenShowMode = useCallback(
    (v: boolean | ((prev: boolean) => boolean)) => {
      setFullscreenShowModeState((prev) => {
        const newValue = typeof v === "function" ? v(prev) : v;
        localStorage.setItem(
          SETTINGS.fullscreenShowMode.key,
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

  const value = useMemo(
    () => ({
      volume,
      setVolume,
      durationWork,
      setDurationWork,
      durationBreak,
      setDurationBreak,
      inverseColorsFullscreen,
      setInverseColorsFullscreen,
      fullscreenShowMode,
      setFullscreenShowMode,
      resetSettings,
    }),
    [
      volume,
      setVolume,
      durationWork,
      setDurationWork,
      durationBreak,
      setDurationBreak,
      inverseColorsFullscreen,
      setInverseColorsFullscreen,
      fullscreenShowMode,
      setFullscreenShowMode,
      resetSettings,
    ]
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettingsContext() {
  const ctx = use(SettingsContext);
  if (!ctx) {
    throw new Error("useSettingsContext must be inside SettingsProvider");
  }
  return ctx;
}
