import "./TimerFullscreen.css";
import type { TimerMode } from "../other/types.websocket";
import { formatTimerSeconds } from "../utils/formatTimerSeconds";
import { useSettingsContext } from "../contexts/SettingsContext";

export interface TimerFullscreenProps {
  remainingS: number;
  mode: TimerMode;
  isPaused: boolean;
}

export function TimerFullscreen({
  remainingS,
  mode,
  isPaused,
}: TimerFullscreenProps) {
  const { inverseColorsFullscreen, fullscreenShowMode } = useSettingsContext();
  return (
    <div
      className={
        "timer-fullscreen" + (inverseColorsFullscreen ? " inverse" : "")
      }
    >
      <div className={isPaused ? "timer-fullscreen-content-paused" : ""}>
        <div className="timer-fullscreen-timer">
          {formatTimerSeconds(remainingS)}
        </div>
        {fullscreenShowMode && (
          <div className="timer-fullscreen-mode">{mode}</div>
        )}
      </div>
      {isPaused && (
        <div className="timer-fullscreen-pause-indicator">
          <div className="pause-bars">
            <div className="pause-bar"></div>
            <div className="pause-bar"></div>
          </div>
        </div>
      )}
    </div>
  );
}
