import { DEFAULTS, SETTINGS } from "./constants";
import "./SettingsPage.css";
import { useCallback, useState } from "react";

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

  const changeSetting = (
    setting: string,
    newValue: string | number,
    setSetting: (n: number) => void
  ) => {
    setSetting(Number(newValue));
    localStorage.setItem(setting, newValue.toString());
  };

  const onSettingsReset = useCallback(() => {
    changeSetting(SETTINGS.volume, DEFAULTS.volume, setVolume);
    changeSetting(
      SETTINGS.durationWork,
      DEFAULTS.durationWork,
      setDurationWork
    );
    changeSetting(
      SETTINGS.durationBreak,
      DEFAULTS.durationBreak,
      setDurationBreak
    );
  }, []);

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
          onChange={(e) =>
            changeSetting(SETTINGS.volume, e.target.value, setVolume)
          }
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
            changeSetting(
              SETTINGS.durationWork,
              e.target.value,
              setDurationWork
            )
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
            changeSetting(
              SETTINGS.durationBreak,
              e.target.value,
              setDurationBreak
            )
          }
        />
      </div>
      <div className="settings-row">
        <button className="settings-reset" onClick={onSettingsReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
