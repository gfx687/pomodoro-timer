import { useReducer, useEffect, useCallback } from "react";
import type { PomodoroMode, TimerStatusResponsePayload } from "./types";
import { timerReducer, initialState } from "./useTimerState.reducer";

export function useTimerState() {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    if (!state.isTicking) return;

    const interval = setInterval(() => {
      dispatch({ type: "TIMER_TICK" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isTicking]);

  useEffect(() => {
    if (state.seconds <= 0 && state.isTicking) {
      dispatch({ type: "TIMER_FINISH" });
    }
  }, [state.seconds, state.isTicking]);

  const startTimer = useCallback((startedAt: Date) => {
    dispatch({
      type: "TIMER_START_OR_RESUME",
      payload: { startedAt: startedAt },
    });
  }, []);

  const resetTimer = useCallback(() => {
    dispatch({ type: "TIMER_RESET" });
  }, []);

  const pauseTimer = useCallback(() => {
    dispatch({ type: "TIMER_PAUSE" });
  }, []);

  const resumeTimer = useCallback(() => {
    dispatch({ type: "TIMER_START_OR_RESUME", payload: { startedAt: null } });
  }, []);

  const changeMode = useCallback(
    (newMode: PomodoroMode) => {
      if (state.doesExist) return;

      dispatch({ type: "CHANGE_MODE", payload: { mode: newMode } });
    },
    [state.doesExist]
  );

  const setStatus = useCallback((payload: TimerStatusResponsePayload) => {
    dispatch({ type: "SET_STATUS", payload });
  }, []);

  return {
    state,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    changeMode,
    setStatus,
  };
}
