export type PomodoroMode = "Work" | "Break";

export interface TimerStartRequest {
  type: "TimerStart";
  payload: number;
}

export interface TimerPauseRequest {
  type: "TimerPause";
}

export interface TimerResetRequest {
  type: "TimerReset";
}

export type OutgoingMessage =
  | TimerGetRequest
  | TimerStartRequest
  | TimerPauseRequest
  | TimerResetRequest;

export interface TimerStatusResponse {
  type: "TimerStatus";
  payload: {
    IsActive: boolean;
    RemainingS: number;
    Mode: PomodoroMode;
  };
}

export interface TimerNotFoundResponse {
  type: "TimerNotFound";
}

export interface TimerResetResponse {
  type: "TimerReset";
}

export interface TimerGetRequest {
  type: "TimerGet";
}

export type IncomingMessage =
  | TimerStatusResponse
  | TimerNotFoundResponse
  | TimerResetResponse;
