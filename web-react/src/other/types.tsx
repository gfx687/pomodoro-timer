export type TimerMode = "Work" | "Break";

export interface TimerGetRequest {
  type: "TimerGet";
}

export interface TimerStartRequest {
  type: "TimerStart";
  payload: {
    durationTotal: number;
    mode: TimerMode;
    startedAt: Date;
    remaining: number;
  };
}

export interface TimerPauseRequest {
  type: "TimerPause";
  payload: TimerIdPayload;
}

export interface TimerUnpauseRequest {
  type: "TimerUnpause";
  payload: TimerIdPayload;
}

export interface TimerResetRequest {
  type: "TimerReset";
  payload: TimerIdPayload;
}

export interface TimerIdPayload {
  /**
   * UUID
   */
  id: string;
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
  Id: string;
  IsActive: boolean;
  RemainingS: number;
  Mode: TimerMode;
  StartedAt: Date;
}

export interface TimerNotFoundResponse {
  type: "TimerNotFound";
}

export interface TimerResetResponse {
  type: "TimerReset";
}

export interface TimerAlreadyExistsResponse {
  type: "TimerAlreadyExists";
  payload: TimerStatusResponsePayload;
}

export type IncomingMessage =
  | TimerStatusResponse
  | TimerNotFoundResponse
  | TimerResetResponse;
