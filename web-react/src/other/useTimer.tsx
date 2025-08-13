import { useReducer, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import type { IncomingMessage, PomodoroMode } from "./types";
import {
  timerReducer,
  initialState,
  getModeDuration,
} from "./useTimer.reducer";

const WEBSOCKET_URL = "ws://localhost:5170/ws";

export function useTimer() {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<IncomingMessage>(
    WEBSOCKET_URL,
    {
      shouldReconnect: () => true,
      share: true,
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      switch (lastJsonMessage.type) {
        case "TimerStatus":
          dispatch({ type: "SET_STATUS", payload: lastJsonMessage.payload });
          break;
        case "TimerNotFound":
        case "TimerReset":
          dispatch({ type: "TIMER_RESET" });
          break;
        default:
          break;
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (!state.isActive) return;

    const interval = setInterval(() => {
      dispatch({ type: "TIMER_TICK" });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isActive]);

  const start = useCallback(() => {
    dispatch({ type: "TIMER_START" });
    sendJsonMessage({
      type: "TimerStart",
      payload: { duration: getModeDuration(state.mode), mode: state.mode },
    });
  }, [state.mode, sendJsonMessage]);

  const pause = useCallback(() => {
    dispatch({ type: "TIMER_INACTIVE" });
    sendJsonMessage({ type: "TimerPause" });
  }, [sendJsonMessage]);

  const reset = useCallback(() => {
    dispatch({ type: "TIMER_RESET" });
    sendJsonMessage({ type: "TimerReset" });
  }, [sendJsonMessage]);

  function changeMode(newMode: PomodoroMode) {
    if (state.seconds !== 0 && state.seconds !== getModeDuration(state.mode)) {
      return;
    }

    dispatch({ type: "CHANGE_MODE", payload: { mode: newMode } });
  }

  return { state, reset, pause, start, changeMode };
}
