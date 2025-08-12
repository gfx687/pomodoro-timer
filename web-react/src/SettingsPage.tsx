import { DEFAULTS, SETTINGS } from "./constants";
import "./SettingsPage.css";
import { useState } from "react";

export default function SettingsPage() {
  const [volume, setVolume] = useState(() => {
    const v = localStorage.getItem(SETTINGS.volume);
    return v !== null ? Number(v) : DEFAULTS.volume;
  });

  const [durationWork, setDurationWork] = useState(() => {
    const v = localStorage.getItem(SETTINGS.durationWork);
    return v !== null ? Number(v) : DEFAULTS.durationWork;
  });

  const [durationBreak, setDurationBreak] = useState(() => {
    const v = localStorage.getItem(SETTINGS.durationBreak);
    return v !== null ? Number(v) : DEFAULTS.durationBreak;
  });

  const onNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setting: string,
    setSetting: (n: number) => void
  ) => {
    setSetting(Number(event.target.value));
    localStorage.setItem(setting, event.target.value);
  };

  return (
    <div className="settings">
      <div className="settings-row">
        <label htmlFor="volume" className="settings-label">
          Alert volume
        </label>
        <br />
        <input
          id="volume"
          type="range"
          className="settings-input"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onNumberChange(e, SETTINGS.volume, setVolume)}
        />
        <span style={{ marginLeft: "5px" }}>{volume}</span>
      </div>
      <div className="settings-row">
        <label htmlFor="duration-work">Work duration</label>
        <input
          id="duration-work"
          type="number"
          className="settings-input"
          value={durationWork}
          onChange={(e) =>
            onNumberChange(e, SETTINGS.durationWork, setDurationWork)
          }
        />
      </div>
      <div className="settings-row">
        <label htmlFor="duration-break">Break duration</label>
        <input
          id="duration-break"
          type="number"
          className="settings-input"
          value={durationBreak}
          onChange={(e) =>
            onNumberChange(e, SETTINGS.durationBreak, setDurationBreak)
          }
        />
      </div>
    </div>
  );
}
