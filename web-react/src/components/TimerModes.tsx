import type { TimerMode } from "../other/types.websocket";
import "./TimerModes.css";

interface TimerModesProps {
  currentMode: TimerMode;
  timerExists: boolean;
  onModeChange: (mode: TimerMode) => void;
}

export default function TimerModes({
  currentMode,
  timerExists,
  onModeChange,
}: TimerModesProps) {
  const getClasses = (m: TimerMode) => {
    let c = "timer-mode";
    if (currentMode === m) c += " timer-mode-current";
    else if (timerExists) c += " timer-mode-not-allowed";
    return c;
  };

  const getSliderClass = () => {
    switch (currentMode) {
      case "Break":
        return "timer-modes-slider break";
      case "LongBreak":
        return "timer-modes-slider longbreak";
      case "Work":
      default:
        return "timer-modes-slider work";
    }
  };

  return (
    <div className="timer-modes">
      <div className={getSliderClass()}></div>
      <button
        type="button"
        className={getClasses("Work")}
        onClick={() => onModeChange("Work")}
        title={currentMode === "Work" ? "" : "Timer is running."}
      >
        Work
      </button>
      <button
        type="button"
        className={getClasses("Break")}
        onClick={() => onModeChange("Break")}
        title={currentMode === "Break" ? "" : "Timer is running."}
      >
        Break
      </button>
      <button
        type="button"
        className={getClasses("LongBreak")}
        onClick={() => onModeChange("LongBreak")}
        title={currentMode === "LongBreak" ? "" : "Timer is running."}
      >
        Long Break
      </button>
    </div>
  );
}
