import { useCallback, useEffect, type RefObject } from "react";
import { TIMER_MODES, type TimerMode } from "../other/types.websocket";
import { type TimerState } from "./useTimerState.reducer";

export function useTimerHotkeys(
  stateRef: RefObject<TimerState>,
  start: () => void,
  pause: () => void,
  resume: () => void,
  reset: () => void,
  changeMode: (m: TimerMode) => void,
  setFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void
) {
  const onPressSpace = useCallback(() => {
    if (stateRef.current.status == "ticking") pause();
    else if (stateRef.current.status == "paused") resume();
    else start();
    // linter does not know that stateRef is a ref, so it warns us
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, pause, resume]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        onPressSpace();
      } else if (e.key === "f" || e.key === "F") {
        setFullscreen((x) => !x);
      } else if (e.key === "Escape") {
        setFullscreen(false);
      } else if (e.key === "R") {
        reset();
      } else if (e.key === "1") {
        changeMode(TIMER_MODES[0]);
      } else if (e.key === "2") {
        changeMode(TIMER_MODES[1]);
      } else if (e.key === "3") {
        changeMode(TIMER_MODES[2]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPressSpace, setFullscreen, reset, changeMode]);
}
