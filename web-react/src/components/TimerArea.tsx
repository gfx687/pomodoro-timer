import { useEffect } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes from "./TimerModes";
import Timer from "./Timer";
import useDink from "../other/useDink";
import { useTimer } from "../other/useTimer";
import { getModeDuration } from "../other/useTimer.reducer";

export default function TimerArea() {
  const playDink = useDink();
  const { state, reset, pause, start, changeMode } = useTimer();

  useEffect(() => {
    if (state.seconds > 0) return;

    pause();

    if (state.isActive) playDink();
  }, [state.seconds, state.isActive, pause, playDink]);

  return (
    <div className="timer-area">
      <TimerModes
        mode={state.mode}
        inProgress={
          state.seconds !== 0 && state.seconds !== getModeDuration(state.mode)
        }
        onModeChange={changeMode}
      />
      <Timer seconds={state.seconds} />
      <TimerControls
        active={state.isActive}
        currentS={state.seconds}
        totalS={getModeDuration(state.mode)}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
    </div>
  );
}
