import { useState, useCallback } from "react";
import { SETTINGS, type SettingsKey } from "./constants";
import type { PomodoroMode } from "./types";

export function getModeDuration(mode: PomodoroMode) {
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

export function useSettings() {
  const [volume, setVolume] = useState(() => {
    const v = localStorage.getItem(SETTINGS.volume.key);
    return v !== null ? Number(v) : SETTINGS.volume.defaultValue;
  });

  const [durationWork, setDurationWork] = useState(() => {
    const v = localStorage.getItem(SETTINGS.durationWork.key);
    return v !== null ? Number(v) : SETTINGS.durationWork.defaultValue;
  });

  const [durationBreak, setDurationBreak] = useState(() => {
    const v = localStorage.getItem(SETTINGS.durationBreak.key);
    return v !== null ? Number(v) : SETTINGS.durationBreak.defaultValue;
  });

  const [inverseColorsFullscreen, setInverseColorsFullscreen] = useState(() => {
    const v = localStorage.getItem(SETTINGS.inverseColorsFullscreen.key);
    return v !== null
      ? v === "true"
      : SETTINGS.inverseColorsFullscreen.defaultValue;
  });

  const changeSetting = useCallback(
    (setting: SettingsKey, newValue: string) => {
      let setter;
      switch (setting) {
        case "volume":
          setter = (s: string) => setVolume(Number(s));
          break;
        case "durationWork":
          setter = (s: string) => setDurationWork(Number(s));
          break;
        case "durationBreak":
          setter = (s: string) => setDurationBreak(Number(s));
          break;
        case "inverseColorsFullscreen":
          setter = (s: string) => {
            setInverseColorsFullscreen(s === "true");
          };
          break;
      }
      setter(newValue);
      localStorage.setItem(setting, newValue);
    },
    []
  );

  const resetSettings = useCallback(() => {
    changeSetting(SETTINGS.volume.key, SETTINGS.volume.defaultValue.toString());
    changeSetting(
      SETTINGS.durationWork.key,
      SETTINGS.durationWork.defaultValue.toString()
    );
    changeSetting(
      SETTINGS.durationBreak.key,
      SETTINGS.durationBreak.defaultValue.toString()
    );
    changeSetting(
      SETTINGS.inverseColorsFullscreen.key,
      SETTINGS.inverseColorsFullscreen.defaultValue.toString()
    );
  }, [changeSetting]);

  return {
    volume,
    durationWork,
    durationBreak,
    inverseColorsFullscreen,
    changeSetting,
    resetSettings,
  };
}
