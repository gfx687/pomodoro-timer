import { SETTINGS } from "./constants";
import "./SettingsPage.css";
import { useState, useEffect } from "react";

// TODO: some sign that the sounds are muted

export default function SettingsPage() {
  const [volume, setVolume] = useState(() => {
    const v = localStorage.getItem(SETTINGS.volume);
    return v !== null ? Number(v) : 50;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS.volume, volume.toString());
  }, [volume]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  return (
    <>
      <h2>Settings</h2>
      <div className="settings-row">
        <label htmlFor="volume" className="settings-label">
          Alert volume
        </label>
        <br />
        <input
          type="range"
          id="volume"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="settings-input"
        />
        <span style={{marginLeft: "5px"}}>{volume}</span>
      </div>
    </>
  );
}
