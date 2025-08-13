import { DEFAULTS, SETTINGS } from "./constants";
import type { PomodoroMode } from "./types";

export interface TimerState {
  isActive: boolean;
  seconds: number;
  mode: PomodoroMode;
}

export const initialState: TimerState = {
  isActive: false,
  seconds: getModeDuration("Work"),
  mode: "Work",
};

export type TimerAction =
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

export function timerReducer(
  state: TimerState,
  action: TimerAction
): TimerState {
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
        seconds:
          state.seconds == 0 ? getModeDuration(state.mode) : state.seconds,
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
        seconds: getModeDuration(state.mode),
      };
    case "CHANGE_MODE":
      return {
        ...state,
        isActive: false,
        seconds: getModeDuration(action.payload.mode),
        mode: action.payload.mode,
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
