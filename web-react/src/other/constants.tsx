export type SettingsKey =
  | "volume"
  | "durationWork"
  | "durationBreak"
  | "inverseColorsFullscreen"
  | "fullscreenShowMode";

export const SETTINGS = {
  volume: {
    key: "volume" as SettingsKey,
    defaultValue: 50,
  },
  durationWork: {
    key: "durationWork" as SettingsKey,
    defaultValue: 1800,
  },
  durationBreak: {
    key: "durationBreak" as SettingsKey,
    defaultValue: 300,
  },
  inverseColorsFullscreen: {
    key: "inverseColorsFullscreen" as SettingsKey,
    defaultValue: false,
  },
  fullscreenShowMode: {
    key: "fullscreenShowMode" as SettingsKey,
    defaultValue: false,
  },
};
