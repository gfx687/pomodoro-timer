import { useCallback, useEffect, useReducer } from "react";
import "./TimerArea.css";
import TimerControls from "./TimerControls";
import TimerModes from "./TimerModes";
import Timer from "./Timer";
import { DEFAULTS, SETTINGS } from "../constants";
import useDink from "../other/useDink";
import useWebSocket from "react-use-websocket";
import { type IncomingMessage, type PomodoroMode } from "../other/types";

const WEBSOCKET_URL = "ws://localhost:5170/ws";

interface TimerState {
  isActive: boolean;
  seconds: number;
  mode: PomodoroMode;
}

const initialState: TimerState = {
  isActive: false,
  seconds: getDuration("Work"),
  mode: "Work",
};

type TimerAction =
  | {
      type: "SET_STATUS";
      payload: {
        IsActive: boolean;
        RemainingS: number;
        Mode: PomodoroMode;
      };
    }
  | { type: "TIMER_START" }
  | { type: "TIMER_INACTIVE" }
  | { type: "TIMER_TICK" }
  | { type: "TIMER_RESET" }
  | { type: "CHANGE_MODE"; payload: { mode: PomodoroMode } };

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "SET_STATUS":
      return {
        ...state,
        isActive: action.payload.IsActive,
        seconds: action.payload.RemainingS,
        mode: action.payload.Mode,
      };
    case "TIMER_START":
      return {
        ...state,
        isActive: true,
        seconds: state.seconds == 0 ? getDuration(state.mode) : state.seconds,
      };
    case "TIMER_INACTIVE":
      return {
        ...state,
        isActive: false,
      };
    case "TIMER_TICK":
      return {
        ...state,
        seconds: state.seconds - 1,
      };
    case "TIMER_RESET":
      return {
        ...state,
        isActive: false,
        seconds: getDuration(state.mode),
      };
    case "CHANGE_MODE":
      return {
        ...state,
        isActive: false,
        seconds: getDuration(action.payload.mode),
        mode: action.payload.mode,
      };
  }
}

export default function TimerArea() {
  const playDink = useDink();
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

  useEffect(() => {
    if (state.seconds > 0) return;

    dispatch({ type: "TIMER_INACTIVE" });

    if (state.isActive) playDink();
  }, [state.seconds, state.isActive, playDink]);

  const onReset = useCallback(() => {
    dispatch({ type: "TIMER_RESET" });
    sendJsonMessage({ type: "TimerReset" });
  }, [sendJsonMessage]);

  const onPause = useCallback(() => {
    dispatch({ type: "TIMER_INACTIVE" });
    sendJsonMessage({ type: "TimerPause" });
  }, [sendJsonMessage]);

  const onStart = useCallback(() => {
    dispatch({ type: "TIMER_START" });
    sendJsonMessage({
      type: "TimerStart",
      payload: { duration: getDuration(state.mode), mode: state.mode },
    });
  }, [state.mode, sendJsonMessage]);

  function onModeChange(newMode: PomodoroMode) {
    if (state.seconds !== 0 && state.seconds !== getDuration(state.mode)) {
      return;
    }

    dispatch({ type: "CHANGE_MODE", payload: { mode: newMode } });
  }

  return (
    <div className="timer-area">
      <TimerModes
        mode={state.mode}
        inProgress={
          state.seconds !== 0 && state.seconds !== getDuration(state.mode)
        }
        onModeChange={onModeChange}
      />
      <Timer seconds={state.seconds} />
      <TimerControls
        active={state.isActive}
        currentS={state.seconds}
        totalS={getDuration(state.mode)}
        onStart={onStart}
        onPause={onPause}
        onReset={onReset}
      />
    </div>
  );
}

function getDuration(mode: PomodoroMode) {
  switch (mode) {
    case "Break": {
      const v = localStorage.getItem(SETTINGS.durationBreak);
      return v !== null ? Number(v) : DEFAULTS.durationBreak;
    }
    case "Work":
    default: {
      const v = localStorage.getItem(SETTINGS.durationWork);
      return v !== null ? Number(v) : DEFAULTS.durationWork;
    }
  }
}
