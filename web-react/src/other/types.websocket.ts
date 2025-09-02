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
    isActive: boolean;
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
  /**
   * Null if IsActive = false
   */
  ExpiresAt: Date | null;
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

export interface TimerFinishedResponse {
  type: "TimerFinished";
  payload: TimerIdPayload;
}

export interface ErrorResponse {
  type: "Error";
  payload: ErrorPayload;
}

export type ErrorType =
  | "UnknownRequestType"
  | "ValidationError"
  | "WrongRequestFormat"
  | "IncorrectTimerId";

export interface ErrorPayload {
  ErrorType: ErrorType;
  Message: string;
}

export type IncomingMessage =
  | ErrorResponse
  | TimerStatusResponse
  | TimerNotFoundResponse
  | TimerResetResponse
  | TimerAlreadyExistsResponse
  | TimerFinishedResponse;
