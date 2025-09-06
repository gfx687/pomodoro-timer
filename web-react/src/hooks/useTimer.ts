import { useEffect, useCallback, useState, useRef } from "react";
import type { TimerMode } from "../other/types.websocket";
import { useWebSocketConnection } from "./useWebSocketConnection";
import { useTimerState } from "./useTimerState";
import { isAnActiveStatus } from "./useTimerState.reducer";
import { useSettingsContext } from "../contexts/SettingsContext";

export function useTimer() {
  const { sendMessage, lastMessage } = useWebSocketConnection();
  const {
    state,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    changeMode: changeModeInternal,
    finishTimer,
    setStatus,
  } = useTimerState();
  const [syncToBackend, setSyncToBackend] = useState(false);
  const stateRef = useRef(state);
  const { durationWork, durationBreak, durationLongBreak } =
    useSettingsContext();

  // TODO: handle
  const getModeDuration = useCallback(
    (mode: TimerMode) => {
      switch (mode) {
        case "Break": {
          return durationBreak;
        }
        case "LongBreak": {
          return durationLongBreak;
        }
        case "Work":
        default: {
          return durationWork;
        }
      }
    },
    [durationWork, durationBreak, durationLongBreak]
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case "TimerAlreadyExists":
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
          resetTimer(getModeDuration(stateRef.current.mode));
          break;
        case "TimerFinished":
          console.log("FINISH: " + JSON.stringify(lastMessage));
          finishTimer();
          break;
        case "Error":
          console.error(lastMessage);
          break;
        default:
          break;
      }
    }
  }, [lastMessage, setStatus, resetTimer, finishTimer, getModeDuration]);

  useEffect(() => {
    if (!syncToBackend) return;

    sendMessage({
      type: "TimerStart",
      payload: {
        durationTotal: getModeDuration(stateRef.current.mode),
        mode: stateRef.current.mode,
        // TODO: has to be not null at this point but I want to ensure even if a bug sneaks through it will not crash
        startedAt: stateRef.current.startedAt!,
        remaining: stateRef.current.remainingS,
        isActive: stateRef.current.status == "ticking",
      },
    });

    setSyncToBackend(false);
  }, [syncToBackend, sendMessage, getModeDuration]);

  const start = useCallback(() => {
    const now = new Date();
    const duration = getModeDuration(stateRef.current.mode);
    startTimer(duration, now);
    sendMessage({
      type: "TimerStart",
      payload: {
        durationTotal: duration,
        mode: stateRef.current.mode,
        startedAt: now,
        remaining: duration,
        isActive: true,
      },
    });
  }, [sendMessage, startTimer, getModeDuration]);

  const resume = useCallback(() => {
    resumeTimer();
    sendMessage({ type: "TimerUnpause", payload: { id: stateRef.current.id } });
  }, [sendMessage, resumeTimer]);

  const pause = useCallback(() => {
    pauseTimer();
    sendMessage({ type: "TimerPause", payload: { id: stateRef.current.id } });
  }, [sendMessage, pauseTimer]);

  const reset = useCallback(() => {
    resetTimer(getModeDuration(stateRef.current.mode));
    sendMessage({ type: "TimerReset", payload: { id: stateRef.current.id } });
  }, [sendMessage, resetTimer, getModeDuration]);

  const changeMode = useCallback(
    (newMode: TimerMode) => {
      changeModeInternal(newMode, getModeDuration(newMode));
    },
    [changeModeInternal, getModeDuration]
  );

  return { state, stateRef, reset, pause, resume, start, changeMode };
}
