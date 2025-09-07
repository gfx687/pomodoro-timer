import { useEffect, useRef } from "react";
import TimerControls from "../components/TimerControls";
import TimerModes from "../components/TimerModes";
import Timer from "../components/Timer";
import useDink from "../hooks/useDink";
import { useTimer } from "../hooks/useTimer";
import { useFullscreenContext } from "../contexts/FullscreenContext";
import { useTimerHotkeys } from "../hooks/useTimerHotkeys";
import { isAnActiveStatus } from "../hooks/useTimerState.reducer";
import { TimerFullscreen } from "../components/TimerFullscreen";

export default function TimerPage() {
  const playDink = useDink();
  const { state, stateRef, start, pause, resume, reset, changeMode } =
    useTimer();
  const { isTimerFullscreen, setIsTimerFullscreen } = useFullscreenContext();
  useTimerHotkeys(
    stateRef,
    start,
    pause,
    resume,
    reset,
    changeMode,
    setIsTimerFullscreen,
  );

  // don't play sound if user refreshes the page with 00:00 timer
  const prevIsFinished = useRef(state.status == "finished");
  useEffect(() => {
    if (state.status == "finished" && !prevIsFinished.current) {
      playDink();
    }
    prevIsFinished.current = state.status == "finished";
  }, [state.status, playDink]);

  if (isTimerFullscreen)
    return (
      <div className="mt-2 text-center">
        <TimerFullscreen
          remainingS={state.remainingS}
          mode={state.mode}
          isPaused={state.status === "paused"}
        />
      </div>
    );

  return (
    <div className="mt-2 text-center">
      <TimerModes
        currentMode={state.mode}
        timerExists={isAnActiveStatus(state.status)}
        onModeChange={changeMode}
      />
      <div className="bg-bg-alt rounded-2xl pb-8">
        <Timer remainingS={state.remainingS} />
        <TimerControls
          timerStatus={state.status}
          onStart={start}
          onResume={resume}
          onPause={pause}
          onReset={reset}
        />
      </div>
    </div>
  );
}
