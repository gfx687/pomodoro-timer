import { SETTINGS } from "../other/constants";
import type { TimerMode } from "../other/types.websocket";

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
