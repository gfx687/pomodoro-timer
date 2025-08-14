import { useCallback, useEffect } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes from "./TimerModes";
import Timer from "./Timer";
import useDink from "../other/useDink";
import { useTimer } from "../other/useTimer";
import { getModeDuration } from "../other/useTimerState.reducer";
import { useFullscreen } from "../other/FullscreenContext";

export default function TimerArea() {
  const playDink = useDink();
  const { state, reset, pause, resume, start, changeMode } = useTimer();
  const { isFullscreen, setFullscreen } = useFullscreen();

  useEffect(() => {
    if (state.isFinished) {
      playDink();
    }
  }, [state.isFinished, playDink]);

  const onPressSpace = useCallback(() => {
    if (state.isTicking) {
      pause();
      return;
    }

    start();
  }, [state.isTicking, pause, start]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        onPressSpace();
      } else if (e.key === "f" || e.key === "F" || e.code === "KeyF") {
        setFullscreen((x) => !x);
      } else if (e.key === "R") {
        reset();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPressSpace, setFullscreen, reset]);

  return (
    <div className="timer-area">
      <TimerModes
        mode={state.mode}
        timerExists={state.doesExist}
        onModeChange={changeMode}
      />
      <Timer seconds={state.seconds} isFullscreen={isFullscreen} />
      <TimerControls
        isTicking={state.isTicking}
        currentS={state.seconds}
        totalS={getModeDuration(state.mode)}
        onStart={start}
        onResume={resume}
        onPause={pause}
        onReset={reset}
      />
    </div>
  );
}
