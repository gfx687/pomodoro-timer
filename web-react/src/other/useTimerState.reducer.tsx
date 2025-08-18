import { getModeDuration } from "../contexts/SettingsContext";
import type { TimerMode, TimerStatusResponsePayload } from "./types";

export type TimerStatus = "no timer" | "ticking" | "paused" | "finished";

export const isAnActiveStatus = (status: TimerStatus) =>
  status == "ticking" || status == "paused";

export interface TimerState {
  id: string;
  status: TimerStatus;
  seconds: number;
  mode: TimerMode;
  startedAt: Date | null;
}

export const initialState: TimerState = {
  id: "",
  status: "no timer",
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
  | { type: "CHANGE_MODE"; payload: { mode: TimerMode } };

export function timerReducer(
  state: TimerState,
  action: TimerAction
): TimerState {
  switch (action.type) {
    case "SET_STATUS":
      return {
        ...state,
        id: action.payload.Id,
        status: action.payload.IsActive ? "ticking" : "paused",
        seconds: action.payload.RemainingS,
        mode: action.payload.Mode,
        startedAt: action.payload.StartedAt
          ? new Date(action.payload.StartedAt)
          : null,
      };
    case "TIMER_START_OR_RESUME": {
      const seconds = isAnActiveStatus(state.status)
        ? state.seconds
        : getModeDuration(state.mode);
      return {
        ...state,
        status: "ticking",
        seconds: seconds,
        startedAt: action.payload.startedAt ?? state.startedAt,
      };
    }
    case "TIMER_TICK":
      return {
        ...state,
        seconds: state.seconds - 1,
      };
    case "TIMER_PAUSE":
      return {
        ...state,
        status: "paused",
      };
    case "TIMER_FINISH":
      return {
        ...state,
        status: "finished",
      };
    case "TIMER_RESET":
      return {
        ...state,
        status: "no timer",
        seconds: getModeDuration(state.mode),
        startedAt: null,
      };
    case "CHANGE_MODE":
      return {
        ...state,
        status: "no timer",
        seconds: getModeDuration(action.payload.mode),
        mode: action.payload.mode,
        startedAt: null,
      };
  }
}
