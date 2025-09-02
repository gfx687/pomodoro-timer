import { useReducer, useEffect, useCallback } from "react";
import {
  timerReducer,
  initialState,
  type TimerState,
  isAnActiveStatus,
} from "../hooks/useTimerState.reducer";
import type {
  TimerMode,
  TimerStatusResponsePayload,
} from "../other/types.websocket";

export function useTimerState() {
  const [state, dispatch] = useReducer(
    timerReducer,
    initialState,
    (initial) => loadStateFromLocalStorage() || initial
  );

  useEffect(() => {
    if (state.status != "ticking") return;

    dispatch({ type: "TIMER_TICK" });

    const interval = setInterval(() => {
      dispatch({ type: "TIMER_TICK" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  useEffect(() => {
    if (state.remainingS <= 0 && state.status == "ticking") {
      dispatch({ type: "TIMER_FINISH" });
    }
  }, [state.remainingS, state.status]);

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
    (newMode: TimerMode) => {
      if (isAnActiveStatus(state.status)) return;

      dispatch({ type: "CHANGE_MODE", payload: { mode: newMode } });
    },
    [state.status]
  );

  const finishTimer = useCallback(() => {
    dispatch({ type: "TIMER_FINISH" });
  }, []);

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
    finishTimer,
    setStatus,
  };
}

const STORAGE_KEY = "timer-state";

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
