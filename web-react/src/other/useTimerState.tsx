import { useReducer, useEffect, useCallback } from "react";
import type { PomodoroMode, TimerStatusResponsePayload } from "./types";
import {
  timerReducer,
  initialState,
  type TimerState,
} from "./useTimerState.reducer";

export function useTimerState() {
  const [state, dispatch] = useReducer(
    timerReducer,
    initialState,
    (initial) => loadStateFromLocalStorage() || initial
  );

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

  useEffect(() => {
    saveStateToLocalStorage(state);
  }, [state]);

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

const STORAGE_KEY = "pomodoro-timer-state";

function saveStateToLocalStorage(state: TimerState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        startedAt: state.startedAt?.toISOString() || null,
      })
    );
  } catch (error) {
    console.warn("Failed to save timer state to localStorage:", error);
  }
}

function loadStateFromLocalStorage(): TimerState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      startedAt: parsed.startedAt ? new Date(parsed.startedAt) : null,
    };
  } catch (error) {
    console.warn("Failed to load timer state from localStorage:", error);
    return null;
  }
}
