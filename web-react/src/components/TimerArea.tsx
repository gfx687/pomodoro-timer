import { useCallback, useEffect } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes from "./TimerModes";
import Timer from "./Timer";
import useDink from "../other/useDink";
import { useTimer } from "../other/useTimer";
import { getModeDuration } from "../other/useTimer.reducer";
import { useFullscreen } from "../other/FullscreenContext";

export default function TimerArea() {
  const playDink = useDink();
  const { state, reset, pause, start, changeMode } = useTimer();
  const { isFullscreen, setFullscreen } = useFullscreen();

  // should probably just expose isFinished from useTimer() instead
  useEffect(() => {
    if (state.seconds > 0) return;

    // needed because otherwise refreshing the page with 00:00 on it will play the sound
    if (state.isActive) { 
      playDink();
      pause();
    }
  }, [state.seconds, state.isActive, pause, playDink]);

  const onPressSpace = useCallback(() => {
    if (state.isActive) pause();
    else start();
  }, [state.isActive, pause, start]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        onPressSpace();
      } else if (e.key === "f" || e.key === "F" || e.code === "KeyF") {
        setFullscreen((x) => !x);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPressSpace, setFullscreen]);

  return (
    <div className="timer-area">
      <TimerModes
        mode={state.mode}
        inProgress={
          state.seconds !== 0 && state.seconds !== getModeDuration(state.mode)
        }
        onModeChange={changeMode}
      />
      <Timer seconds={state.seconds} isFullscreen={isFullscreen} />
      <TimerControls
        isActive={state.isActive}
        currentS={state.seconds}
        totalS={getModeDuration(state.mode)}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
    </div>
  );
}
