import { useEffect, useRef, useState } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes, { type PomodoroMode } from "./TimerModes";
import Timer from "./Timer";
import alert from "../assets/alert.mp3";
import { SETTINGS } from "../constants";

export const DURATION = new Map<PomodoroMode, number>([
  ["work", 3],
  ["break", 120],
]);

export default function TimerArea() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  const totalS = DURATION.get(mode)!;
  const [seconds, setSeconds] = useState<number>(totalS);
  const audio = useRef<HTMLAudioElement | null>(null);
  const v = localStorage.getItem(SETTINGS.volume);
  const volume = v !== null ? Number(v) : 50;

  useEffect(() => {
    audio.current = new Audio(alert);
    audio.current.preload = "auto";
  }, []);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setSeconds((x) => x - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (seconds > 0) return;

    setActive(false);

    if (audio?.current) {
      audio.current.volume = volume / 100;
      audio.current.currentTime = 0;
      audio.current.play();
    }
  }, [seconds, volume]);

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
