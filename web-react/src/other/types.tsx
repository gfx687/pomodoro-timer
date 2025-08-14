export type PomodoroMode = "Work" | "Break";

export interface TimerGetRequest {
  type: "TimerGet";
}

export interface TimerStartRequest {
  type: "TimerStart";
  payload: {
    durationTotal: number;
    mode: PomodoroMode;
    startedAt: Date;
    remaining: number;
  };
}

export interface TimerPauseRequest {
  type: "TimerPause";
}

export interface TimerUnpauseRequest {
  type: "TimerUnpause";
}

export interface TimerResetRequest {
  type: "TimerReset";
}

export type OutgoingMessage =
  | TimerGetRequest
  | TimerStartRequest
  | TimerPauseRequest
  | TimerUnpauseRequest
  | TimerResetRequest;

export interface TimerStatusResponse {
  type: "TimerStatus";
  payload: TimerStatusResponsePayload;
}

export interface TimerStatusResponsePayload {
  IsActive: boolean;
  RemainingS: number;
  Mode: PomodoroMode;
  StartedAt: Date;
}

export interface TimerNotFoundResponse {
  type: "TimerNotFound";
}

export interface TimerResetResponse {
  type: "TimerReset";
}

export type IncomingMessage =
  | TimerStatusResponse
  | TimerNotFoundResponse
  | TimerResetResponse;
