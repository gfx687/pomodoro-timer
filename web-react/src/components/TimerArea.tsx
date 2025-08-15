import { useEffect, useRef } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes from "./TimerModes";
import Timer from "./Timer";
import useDink from "../other/useDink";
import { useTimer } from "../other/useTimer";
import { useFullscreenContext } from "../contexts/FullscreenContext";
import { useTimerHotkeys } from "../other/useTimerHotkeys";
import { getModeDuration } from "../contexts/SettingsContext";

export default function TimerArea() {
  const playDink = useDink();
  const { state, stateRef, start, pause, resume, reset, changeMode } =
    useTimer();
  const { isFullscreen, setFullscreen } = useFullscreenContext();
  useTimerHotkeys(
    stateRef,
    start,
    pause,
    resume,
    reset,
    changeMode,
    setFullscreen
  );

  // don't play sound if user refreshes the page with 00:00 timer
  const prevIsFinished = useRef(state.isFinished);
  useEffect(() => {
    if (state.isFinished && !prevIsFinished.current) {
      playDink();
    }
    prevIsFinished.current = state.isFinished;
  }, [state.isFinished, playDink]);

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
