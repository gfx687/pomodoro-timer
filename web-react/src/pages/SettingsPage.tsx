import { useSettingsContext } from "../contexts/SettingsContext";
import "./SettingsPage.css";

export function SettingsPage() {
  const {
    volume,
    setVolume,
    durationWork,
    setDurationWork,
    durationBreak,
    setDurationBreak,
    durationLongBreak,
    setDurationLongBreak,
    inverseColorsFullscreen,
    setInverseColorsFullscreen,
    fullscreenShowMode,
    setFullscreenShowMode,
    resetSettings,
  } = useSettingsContext();

  return (
    <div className="mt-2">
      <div className="settings-row">
        <label htmlFor="volume" className="settings-label">
          Alert volume
        </label>
        <input
          id="volume"
          type="range"
          className="ml-auto"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <span style={{ marginLeft: "5px" }}>{volume}</span>
      </div>
      <div className="settings-row">
        <label htmlFor="duration-work">Work duration (sec)</label>
        <input
          id="duration-work"
          type="number"
          className="settings-input-number ml-auto"
          value={durationWork}
          onChange={(e) => setDurationWork(Number(e.target.value))}
        />
      </div>
      <div className="settings-row">
        <label htmlFor="duration-break">Break duration (sec)</label>
        <input
          id="duration-break"
          type="number"
          className="settings-input-number ml-auto"
          value={durationBreak}
          onChange={(e) => setDurationBreak(Number(e.target.value))}
        />
      </div>
      <div className="settings-row">
        <label htmlFor="duration-long-break">Long Break duration (sec)</label>
        <input
          id="duration-long-break"
          type="number"
          className="settings-input-number ml-auto"
          value={durationLongBreak}
          onChange={(e) => setDurationLongBreak(Number(e.target.value))}
        />
      </div>
      <div className="settings-row">
        <label htmlFor="fullscreen-inverse">Fullscreen: Inverse colors</label>
        <input
          id="fullscreen-inverse"
          type="checkbox"
          className="ml-auto"
          checked={inverseColorsFullscreen}
          onChange={(e) => setInverseColorsFullscreen(e.target.checked)}
        />
      </div>
      <div className="settings-row">
        <label htmlFor="fullscreen-show-mode">
          Fullscreen: Show timer mode
        </label>
        <input
          id="fullscreen-show-mode"
          type="checkbox"
          className="ml-auto"
          checked={fullscreenShowMode}
          onChange={(e) => setFullscreenShowMode(e.target.checked)}
        />
      </div>
      <div className="settings-row">
        <button
          type="button"
          className="bg-bg-alt hover:bg-hover active:bg-active ml-auto rounded-lg pt-2 pr-4 pb-2 pl-4"
          onClick={resetSettings}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
