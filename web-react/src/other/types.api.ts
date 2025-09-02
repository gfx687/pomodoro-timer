import type { TimerMode } from "./types.websocket";

export interface ChartDataResponse {
  raw: TimerLog[];
  processed: ChartData;
}

export interface TimerLog {
  id: string;
  action: "Start" | "Pause" | "Unpause" | "Finish" | "Reset";
  mode: TimerMode | null;
  timestamp: Date;
}

export type ChartHeader =
  | { type: string; id: string }
  | { type: string; role: string };

export type ChartData = [ChartHeader[], ...string[]];
