import type { PomodoroMode } from "../other/types";
import "./TimerModes.css";

type TimerModesProps = {
  mode: PomodoroMode;

  // Timer exists, whether it is paused or not does not matter
  inProgress: boolean;
  onModeChange: (mode: PomodoroMode) => void;
};

export default function TimerModes({
  mode,
  inProgress,
  onModeChange,
}: TimerModesProps) {
  const inactiveClass = (m: PomodoroMode) => {
    if (!inProgress) return "";
    return mode === m ? "" : " timer-mode-inactive";
  };

  return (
    <div className="timer-modes">
      <button
        className={
          "timer-mode" +
          (mode === "Work" ? " timer-mode-current" : "") +
          inactiveClass("Work")
        }
        onClick={() => onModeChange("Work")}
      >
        Work
      </button>
      <button
        className={
          "timer-mode" +
          (mode === "Break" ? " timer-mode-current" : "") +
          inactiveClass("Break")
        }
        onClick={() => onModeChange("Break")}
      >
        Break
      </button>
    </div>
  );
}
