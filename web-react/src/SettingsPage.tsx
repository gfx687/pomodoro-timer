import { SETTINGS } from "./other/constants";
import { useSettings } from "./other/useSettings";
import "./SettingsPage.css";

export default function SettingsPage() {
  const {
    volume,
    durationWork,
    durationBreak,
    inverseColorsFullscreen,
    changeSetting,
    resetSettings,
  } = useSettings();
  return (
    <div className="settings">
      <div className="settings-row">
        <label htmlFor="volume" className="settings-label">
          Alert volume
        </label>
        <input
          id="volume"
          type="range"
          className="settings-input"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => changeSetting(SETTINGS.volume.key, e.target.value)}
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
            changeSetting(SETTINGS.durationWork.key, e.target.value)
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
            changeSetting(SETTINGS.durationBreak.key, e.target.value)
          }
        />
      </div>
      <div className="settings-row">
        <label htmlFor="fullscreen-inverse">Inverse colors in fullscreen</label>
        <input
          id="fullscreen-inverse"
          type="checkbox"
          className="settings-input"
          checked={inverseColorsFullscreen}
          onChange={(e) =>
            changeSetting(
              SETTINGS.inverseColorsFullscreen.key,
              e.target.checked.toString()
            )
          }
        />
      </div>
      <div className="settings-row">
        <button className="settings-reset" onClick={resetSettings}>
          Reset
        </button>
      </div>
    </div>
  );
}
