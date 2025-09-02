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

  const onPressW = useCallback(() => {
    const currentIndex = TIMER_MODES.indexOf(stateRef.current.mode);
    const nextIndex = (currentIndex + 1) % TIMER_MODES.length;
    changeMode(TIMER_MODES[nextIndex]);
    // linter does not know that stateRef is a ref, so it warns us
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeMode]);

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
      } else if (e.key === "w" || e.key === "W") {
        onPressW();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPressSpace, setFullscreen, reset, onPressW]);
}
