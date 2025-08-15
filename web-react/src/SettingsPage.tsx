import { useSettingsContext } from "./contexts/SettingsContext";
import "./SettingsPage.css";

export default function SettingsPage() {
  const {
    volume,
    setVolume,
    durationWork,
    setDurationWork,
    durationBreak,
    setDurationBreak,
    inverseColorsFullscreen,
    setInverseColorsFullscreen,
    resetSettings,
  } = useSettingsContext();
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
          onChange={(e) => setVolume(Number(e.target.value))}
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
          onChange={(e) => setDurationWork(Number(e.target.value))}
        />
      </div>
      <div className="settings-row">
        <label htmlFor="duration-break">Break duration</label>
        <input
          id="duration-break"
          type="number"
          className="settings-input"
          value={durationBreak}
          onChange={(e) => setDurationBreak(Number(e.target.value))}
        />
      </div>
      <div className="settings-row">
        <label htmlFor="fullscreen-inverse">Inverse colors in fullscreen</label>
        <input
          id="fullscreen-inverse"
          type="checkbox"
          className="settings-input"
          checked={inverseColorsFullscreen}
          onChange={(e) => setInverseColorsFullscreen(e.target.checked)}
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
