import { addSeconds, differenceInMilliseconds } from "date-fns";
import type {
  TimerMode,
  TimerStatusResponsePayload,
} from "../other/types.websocket";
import { getModeDuration } from "../utils/getModeDuration";

export type TimerStatus = "no timer" | "ticking" | "paused" | "finished";

export const isAnActiveStatus = (status: TimerStatus) =>
  status == "ticking" || status == "paused";

export interface TimerState {
  id: string;
  status: TimerStatus;
  remainingS: number;
  expiresAt: Date | null;
  mode: TimerMode;
  startedAt: Date | null;
}

export const initialState: TimerState = {
  id: "",
  status: "no timer",
  remainingS: getModeDuration("Work"),
  expiresAt: null,
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
        remainingS: action.payload.RemainingS,
        expiresAt: action.payload.ExpiresAt,
        mode: action.payload.Mode,
        startedAt: action.payload.StartedAt
          ? new Date(action.payload.StartedAt)
          : null,
      };
    case "TIMER_START_OR_RESUME": {
      const remainingS = isAnActiveStatus(state.status)
        ? state.remainingS
        : getModeDuration(state.mode);
      return {
        ...state,
        status: "ticking",
        remainingS: remainingS,
        expiresAt: addSeconds(new Date(), remainingS),
        startedAt: action.payload.startedAt ?? state.startedAt,
      };
    }
    case "TIMER_TICK":
      return {
        ...state,
        remainingS: calculateRemaining(state),
      };
    case "TIMER_PAUSE":
      return {
        ...state,
        status: "paused",
        expiresAt: null,
      };
    case "TIMER_FINISH":
      return {
        ...state,
        status: "finished",
        expiresAt: null,
        remainingS: 0,
      };
    case "TIMER_RESET":
      return {
        ...state,
        status: "no timer",
        remainingS: getModeDuration(state.mode),
        expiresAt: null,
        startedAt: null,
      };
    case "CHANGE_MODE":
      return {
        ...state,
        status: "no timer",
        remainingS: getModeDuration(action.payload.mode),
        expiresAt: null,
        mode: action.payload.mode,
        startedAt: null,
      };
  }
}

function calculateRemaining(state: TimerState) {
  if (!isAnActiveStatus(state.status)) return state.remainingS;

  if (state.status === "paused") return state.remainingS;

  // TODO: null check, though it must no be by logic
  return Math.round(
    differenceInMilliseconds(state.expiresAt!, new Date()) / 1000
  );
}
