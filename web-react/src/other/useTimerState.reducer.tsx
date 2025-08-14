import { DEFAULTS, SETTINGS } from "./constants";
import type { PomodoroMode, TimerStatusResponsePayload } from "./types";

export interface TimerState {
  /**
   * Is timer Running or Paused?
   */
  isTicking: boolean;

  /**
   * Does timer exist? Regardless of the Pause state
   */
  doesExist: boolean;

  /**
   * A trigger for subscribers that want to execute an action when timer reaches 0
   * Does not trigger on Reset
   */
  isFinished: boolean;
  seconds: number;
  mode: PomodoroMode;
  startedAt: Date | null;
}

export const initialState: TimerState = {
  doesExist: false,
  isTicking: false,
  isFinished: false,
  seconds: getModeDuration("Work"),
  mode: "Work",
  startedAt: null,
};

export type TimerAction =
  // update using backend data
  | {
      type: "SET_STATUS";
      payload: TimerStatusResponsePayload;
    }
  | { type: "TIMER_START_OR_RESUME"; payload: { startedAt: Date | null } }
  | { type: "TIMER_TICK" }
  | { type: "TIMER_PAUSE" }
  | { type: "TIMER_FINISH" }
  | { type: "TIMER_RESET" }
  | { type: "CHANGE_MODE"; payload: { mode: PomodoroMode } };

export function timerReducer(
  state: TimerState,
  action: TimerAction
): TimerState {
  switch (action.type) {
    case "SET_STATUS":
      console.log("SET_STATUS");
      return {
        ...state,
        doesExist: doesTimerExist(
          action.payload.RemainingS,
          action.payload.Mode
        ),
        isTicking: action.payload.IsActive,
        seconds: action.payload.RemainingS,
        mode: action.payload.Mode,
        isFinished: false,
        startedAt: action.payload.StartedAt,
      };
    case "TIMER_START_OR_RESUME":
      console.log("TIMER_START_OR_RESUME");
      return {
        ...state,
        isTicking: true,
        seconds: doesTimerExist(state.seconds, state.mode)
          ? state.seconds
          : getModeDuration(state.mode),
        doesExist: true,
        isFinished: false,
        startedAt: action.payload.startedAt ?? state.startedAt,
      };
    case "TIMER_TICK":
      console.log("TIMER_TICK");
      return {
        ...state,
        seconds: state.seconds - 1,
      };
    case "TIMER_PAUSE":
      console.log("TIMER_PAUSE");
      return {
        ...state,
        isTicking: false,
      };
    case "TIMER_FINISH":
      console.log("TIMER_FINISH");
      return {
        ...state,
        isTicking: false,
        doesExist: false,
        isFinished: true,
      };
    case "TIMER_RESET":
      console.log("TIMER_RESET");
      return {
        ...state,
        isTicking: false,
        seconds: getModeDuration(state.mode),
        doesExist: false,
        isFinished: false,
        startedAt: null,
      };
    case "CHANGE_MODE":
      console.log("CHANGE_MODE");
      return {
        ...state,
        isTicking: false,
        seconds: getModeDuration(action.payload.mode),
        mode: action.payload.mode,
        doesExist: false,
        isFinished: false,
        startedAt: null,
      };
  }
}

export function getModeDuration(mode: PomodoroMode) {
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

function doesTimerExist(seconds: number, mode: PomodoroMode) {
  return seconds !== 0 && seconds !== getModeDuration(mode);
}
