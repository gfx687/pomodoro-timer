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

  const changeSetting = useCallback(
    (setting: SettingsKey, newValue: string | number) => {
      let setter;
      switch (setting) {
        case "volume":
          setter = setVolume;
          break;
        case "durationWork":
          setter = setDurationWork;
          break;
        case "durationBreak":
          setter = setDurationBreak;
          break;
      }
      setter(Number(newValue));
      localStorage.setItem(setting, newValue.toString());
    },
    []
  );

  const resetSettings = useCallback(() => {
    changeSetting(SETTINGS.volume.key, SETTINGS.volume.defaultValue);
    changeSetting(
      SETTINGS.durationWork.key,

      SETTINGS.durationWork.defaultValue
    );
    changeSetting(
      SETTINGS.durationBreak.key,
      SETTINGS.durationBreak.defaultValue
    );
  }, [changeSetting]);

  return {
    volume,
    durationWork,
    durationBreak,
    changeSetting,
    resetSettings,
  };
}
