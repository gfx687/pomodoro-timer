import { useEffect, useRef } from "react";
import "./TimerPage.css";
import TimerControls from "../components/TimerControls";
import TimerModes from "../components/TimerModes";
import Timer from "../components/Timer";
import useDink from "../other/useDink";
import { useTimer } from "../other/useTimer";
import { useFullscreenContext } from "../contexts/FullscreenContext";
import { useTimerHotkeys } from "../other/useTimerHotkeys";
import { isAnActiveStatus } from "../other/useTimerState.reducer";
import { TimerFullscreen } from "../components/TimerFullscreen";

export default function TimerPage() {
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

  if (isFullscreen)
    return (
      <div className="timer-area">
        <TimerFullscreen
          remainingS={state.remainingS}
          mode={state.mode}
          isPaused={state.status === "paused"}
        />
      </div>
    );

  return (
    <div className="timer-area">
      <TimerModes
        currentMode={state.mode}
        timerExists={isAnActiveStatus(state.status)}
        onModeChange={changeMode}
      />
      <Timer remainingS={state.remainingS} />
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
