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
    let c =
      "flex-1 relative p-3 border-0 bg-inherit rounded-tl-xl rounded-tr-xl cursor-pointer";
    if (currentMode === m) c += " font-bold";
    else if (timerExists) c += " !cursor-not-allowed";
    return c;
  };

  const getSliderClass = () => {
    switch (currentMode) {
      case "Work":
        return "timer-modes-slider left-0";
      case "Break":
        return "timer-modes-slider left-1/3";
      case "LongBreak":
        return "timer-modes-slider left-2/3";
      default:
        return "timer-modes-slider left-0";
    }
  };

  return (
    <div className="relative flex">
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
