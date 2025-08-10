import { useEffect, useRef, useState } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes, { type PomodoroMode } from "./TimerModes";
import Timer from "./Timer";
import alert from "../assets/alert.mp3";
import { DEFAULTS, SETTINGS } from "../constants";

// TODO: this component needs refactoring

export default function TimerArea() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [totalSeconds, setTotalSeconds] = useState<number>(
    DEFAULTS.durationWork
  );
  const [seconds, setSeconds] = useState<number>(() => getDuration("work"));

  const audio = useRef<HTMLAudioElement | null>(null);
  const volume = useState(() => {
    const v = localStorage.getItem(SETTINGS.volume);
    return v !== null ? Number(v) : DEFAULTS.volume;
  })[0];

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

  useEffect(() => {
    setTotalSeconds(getDuration(mode));
  }, [mode]);

  return (
    <div className="timer-area">
      <TimerModes mode={mode} onModeChange={onModeChange} />
      <Timer seconds={seconds} />
      <TimerControls
        active={active}
        currentS={seconds}
        totalS={totalSeconds}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
      />
    </div>
  );

  function onStart() {
    setActive(true);

    if (seconds == 0) {
      setSeconds(totalSeconds);
    }
  }

  function onPause() {
    setActive(false);
  }

  function onReset() {
    setActive(false);
    setSeconds(totalSeconds);
  }

  function onModeChange(mode: PomodoroMode) {
    setActive(false);
    setMode(mode);
    setSeconds(getDuration(mode));
  }
}

function getDuration(mode: PomodoroMode) {
  switch (mode) {
    case "break": {
      const v = localStorage.getItem(SETTINGS.durationBreak);
      return v !== null ? Number(v) : DEFAULTS.durationBreak;
    }
    case "work":
    default: {
      const v = localStorage.getItem(SETTINGS.durationWork);
      return v !== null ? Number(v) : DEFAULTS.durationWork;
    }
  }
}
