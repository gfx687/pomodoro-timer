import { useEffect } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes from "./TimerModes";
import Timer from "./Timer";
import useDink from "../other/useDink";
import { useTimer } from "../other/useTimer";
import { getModeDuration } from "../other/useTimerState.reducer";
import { useFullscreen } from "../other/FullscreenContext";
import { useTimerHotkeys } from "../other/useTimerHotkeys";

export default function TimerArea() {
  const playDink = useDink();
  const { state, stateRef, start, pause, resume, reset, changeMode } =
    useTimer();
  const { isFullscreen, setFullscreen } = useFullscreen();
  useTimerHotkeys(
    stateRef,
    start,
    pause,
    resume,
    reset,
    changeMode,
    setFullscreen
  );

  useEffect(() => {
    if (state.isFinished) {
      playDink();
    }
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
