import { useEffect, useRef } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes from "./TimerModes";
import Timer from "./Timer";
import useDink from "../other/useDink";
import { useTimer } from "../other/useTimer";
import { useFullscreenContext } from "../contexts/FullscreenContext";
import { useTimerHotkeys } from "../other/useTimerHotkeys";
import { isAnActiveStatus } from "../other/useTimerState.reducer";

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
  const prevIsFinished = useRef(state.status == "finished");
  useEffect(() => {
    if (state.status == "finished" && !prevIsFinished.current) {
      playDink();
    }
    prevIsFinished.current = state.status == "finished";
  }, [state.status, playDink]);

  return (
    <div className="timer-area">
      <TimerModes
        currentMode={state.mode}
        timerExists={isAnActiveStatus(state.status)}
        onModeChange={changeMode}
      />
      <Timer seconds={state.seconds} isFullscreen={isFullscreen} />
      <TimerControls
        timerStatus={state.status}
        onStart={start}
        onResume={resume}
        onPause={pause}
        onReset={reset}
      />
    </div>
  );
}
