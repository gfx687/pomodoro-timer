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
    else if (timerExists) c += " timer-mode-inactive";
    return c;
  };

  return (
    <div className="timer-modes">
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
    </div>
  );
}
