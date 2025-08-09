import { useEffect, useState } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes, { type PomodoroMode } from "./TimerModes";
import Timer from "./Timer";

export const DURATION = new Map<PomodoroMode, number>([
  ["work", 600],
  ["break", 120],
]);

export default function TimerArea() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  const totalS = DURATION.get(mode)!;
  const [seconds, setSeconds] = useState<number>(totalS);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setSeconds((x) => x - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (seconds <= 0) {
      setActive(false);
    }
  }, [seconds]);

  return (
    <div className="timer-area">
      <TimerModes mode={mode} onModeChange={onModeChange} />
      <Timer seconds={seconds} />
      <TimerControls
        active={active}
        currentS={seconds}
        totalS={totalS}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
      />
    </div>
  );

  function onStart() {
    setActive(true);

    if (seconds == 0) {
      setSeconds(totalS);
    }
  }

  function onPause() {
    setActive(false);
  }

  function onReset() {
    setActive(false);
    setSeconds(totalS);
  }

  function onModeChange(mode: PomodoroMode) {
    setActive(false);
    setMode(mode);
    setSeconds(DURATION.get(mode)!);
  }
}