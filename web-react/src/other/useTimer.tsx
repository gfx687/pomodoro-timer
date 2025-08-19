import { useEffect, useCallback, useState, useRef } from "react";
import type { TimerMode } from "./types";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { useTimerState } from "./useTimerState";
import { getModeDuration } from "../contexts/SettingsContext";
import { isAnActiveStatus } from "./useTimerState.reducer";

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
          if (isAnActiveStatus(stateRef.current.status)) {
            setSyncToBackend(true);
          }
          break;
        }
        case "TimerReset":
          resetTimer();
          break;
        case "Error":
          console.error(lastMessage);
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
        isActive: stateRef.current.status == "ticking",
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
        durationTotal: getModeDuration(stateRef.current.mode),
        mode: stateRef.current.mode,
        startedAt: now,
        remaining: getModeDuration(stateRef.current.mode),
        isActive: true,
      },
    });
  }, [sendMessage, startTimer]);

  const resume = useCallback(() => {
    resumeTimer();
    sendMessage({ type: "TimerUnpause", payload: { id: stateRef.current.id } });
  }, [sendMessage, resumeTimer]);

  const pause = useCallback(() => {
    pauseTimer();
    sendMessage({ type: "TimerPause", payload: { id: stateRef.current.id } });
  }, [sendMessage, pauseTimer]);

  const reset = useCallback(() => {
    resetTimer();
    sendMessage({ type: "TimerReset", payload: { id: stateRef.current.id } });
  }, [sendMessage, resetTimer]);

  const changeMode = useCallback(
    (newMode: TimerMode) => {
      changeModeInternal(newMode);
    },
    [changeModeInternal]
  );

  return { state, stateRef, reset, pause, resume, start, changeMode };
}
