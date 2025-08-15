import type { TimerMode } from "../other/types";
import "./TimerModes.css";

type TimerModesProps = {
  mode: TimerMode;
  timerExists: boolean;
  onModeChange: (mode: TimerMode) => void;
};

export default function TimerModes({
  mode,
  timerExists,
  onModeChange,
}: TimerModesProps) {
  const getClasses = (m: TimerMode) => {
    let c = "timer-mode";
    if (mode === m) c += " timer-mode-current";
    else if (timerExists) c += " timer-mode-inactive";
    return c;
  };

  return (
    <div className="timer-modes">
      <button
        className={getClasses("Work")}
        onClick={() => onModeChange("Work")}
        title={mode === "Work" ? "" : "Timer is running."}
      >
        Work
      </button>
      <button
        className={getClasses("Break")}
        onClick={() => onModeChange("Break")}
        title={mode === "Break" ? "" : "Timer is running."}
      >
        Break
      </button>
    </div>
  );
}
