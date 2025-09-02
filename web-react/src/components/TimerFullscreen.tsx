import "./TimerFullscreen.css";
import { useSettingsContext } from "../contexts/SettingsContext";
import type { TimerMode } from "../other/types.websocket";
import { formatTimerSeconds } from "../utils/formatTimerSeconds";

export type TimerFullscreenProps = {
  remainingS: number;
  isFullscreen: boolean;
  mode: TimerMode;
};

export function TimerFullscreen({
  remainingS,
  isFullscreen,
  mode,
}: TimerFullscreenProps) {
  const { inverseColorsFullscreen, fullscreenShowMode } = useSettingsContext();
  if (isFullscreen) {
    return (
      <div
        className={
          "timer-fullscreen " + (inverseColorsFullscreen ? " inverse" : "")
        }
      >
        <div className="timer-fullscreen-timer">
          {formatTimerSeconds(remainingS)}
        </div>
        {fullscreenShowMode && (
          <div className="timer-fullscreen-mode">{mode}</div>
        )}
      </div>
    );
  }
}
