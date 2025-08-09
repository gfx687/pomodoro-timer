import "./TimerModes.css";

export type PomodoroMode = "work" | "break";

type TimerModesProps = {
  mode: PomodoroMode;
  onModeChange: (mode: PomodoroMode) => void;
};

export default function TimerModes({ mode, onModeChange }: TimerModesProps) {
  return (
    <div className="timer-modes">
      <button
        className={
          "timer-mode " + (mode === "work" ? "timer-mode-active" : "")
        }
        onClick={() => onModeChange("work")}
      >
        Work
      </button>
      <button
        className={
          "timer-mode " + (mode === "break" ? "timer-mode-active" : "")
        }
        onClick={() => onModeChange("break")}
      >
        Break
      </button>
    </div>
  );
}
