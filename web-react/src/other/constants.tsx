export type SettingsKey = "volume" | "durationWork" | "durationBreak";

export const SETTINGS = {
  volume: {
    key: "volume" as SettingsKey,
    defaultValue: 50,
    type: "number",
    min: 0,
    max: 100,
  },
  durationWork: {
    key: "durationWork" as SettingsKey,
    defaultValue: 1800,
    type: "number",
    min: 60,
  },
  durationBreak: {
    key: "durationBreak" as SettingsKey,
    defaultValue: 300,
    type: "number",
    min: 30,
  },
};
