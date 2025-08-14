import { useEffect, useCallback, useState, useRef } from "react";
import type { PomodoroMode } from "./types";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { useTimerState } from "./useTimerState";
import { getModeDuration } from "./useSettings";

export function useTimer() {
  const { sendMessage, lastMessage } = useWebSocketConnection();
  const {
    state,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    changeMode: changeModeInternal,
    setStatus,
  } = useTimerState();
  const [syncToBackend, setSyncToBackend] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case "TimerStatus":
          setStatus(lastMessage.payload);
          break;
        case "TimerNotFound": {
          if (stateRef.current.doesExist) {
            setSyncToBackend(true);
          }
          break;
        }
        case "TimerReset":
          resetTimer();
          break;
        default:
          break;
      }
    }
  }, [lastMessage, setStatus, resetTimer]);

  useEffect(() => {
    if (!syncToBackend) return;

    sendMessage({
      type: "TimerStart",
      payload: {
        durationTotal: getModeDuration(stateRef.current.mode),
        mode: stateRef.current.mode,
        // TODO: has to be not null at this point but I want to ensure even if a bug sneaks through it will not crash
        startedAt: stateRef.current.startedAt!,
        remaining: stateRef.current.seconds,
      },
    });

    setSyncToBackend(false);
  }, [syncToBackend, sendMessage]);

  const start = useCallback(() => {
    const now = new Date();
    startTimer(now);
    sendMessage({
      type: "TimerStart",
      payload: {
        durationTotal: getModeDuration(state.mode),
        mode: state.mode,
        startedAt: now,
        remaining: getModeDuration(state.mode),
      },
    });
  }, [state.mode, sendMessage, startTimer]);

  const resume = useCallback(() => {
    resumeTimer();
    sendMessage({ type: "TimerUnpause" });
  }, [sendMessage, resumeTimer]);

  const pause = useCallback(() => {
    pauseTimer();
    sendMessage({ type: "TimerPause" });
  }, [sendMessage, pauseTimer]);

  const reset = useCallback(() => {
    resetTimer();
    sendMessage({ type: "TimerReset" });
  }, [sendMessage, resetTimer]);

  const changeMode = useCallback(
    (newMode: PomodoroMode) => {
      changeModeInternal(newMode);
    },
    [changeModeInternal]
  );

  return { state, stateRef, reset, pause, resume, start, changeMode };
}
