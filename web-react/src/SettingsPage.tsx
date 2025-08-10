import { DEFAULTS, SETTINGS } from "./constants";
import "./SettingsPage.css";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    localStorage.setItem(SETTINGS.volume, volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem(SETTINGS.durationWork, durationWork.toString());
  }, [durationWork]);

  useEffect(() => {
    localStorage.setItem(SETTINGS.durationBreak, durationBreak.toString());
  }, [durationBreak]);

  const onVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  const onDurationWorkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDurationWork(Number(event.target.value));
  };

  const onDurationBreakChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDurationBreak(Number(event.target.value));
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
          onChange={onVolumeChange}
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
          onChange={onDurationWorkChange}
        />
      </div>
      <div className="settings-row">
        <label htmlFor="duration-break">Break duration</label>
        <input
          id="duration-break"
          type="number"
          className="settings-input"
          value={durationBreak}
          onChange={onDurationBreakChange}
        />
      </div>
    </div>
  );
}
