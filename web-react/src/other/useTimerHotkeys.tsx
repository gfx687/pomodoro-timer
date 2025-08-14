import { useCallback, useEffect, type RefObject } from "react";
import type { PomodoroMode } from "../other/types";
import {
  getModeDuration,
  type TimerState,
} from "../other/useTimerState.reducer";

export function useTimerHotkeys(
  stateRef: RefObject<TimerState>,
  start: () => void,
  pause: () => void,
  resume: () => void,
  reset: () => void,
  changeMode: (m: PomodoroMode) => void,
  setFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void
) {
  const onPressSpace = useCallback(() => {
    if (stateRef.current.isTicking) {
      pause();
      return;
    }
    return stateRef.current.seconds !== 0 &&
      stateRef.current.seconds != getModeDuration(stateRef.current.mode)
      ? resume()
      : start();
    // linter does not know that stateRef is a ref, so it warns us
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, pause, resume]);

  const onPressW = useCallback(() => {
    const modes: PomodoroMode[] = ["Work", "Break"];
    const currentIndex = modes.indexOf(stateRef.current.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    changeMode(modes[nextIndex]);
    // linter does not know that stateRef is a ref, so it warns us
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeMode]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        onPressSpace();
      } else if (e.key === "f" || e.key === "F") {
        setFullscreen((x) => !x);
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
