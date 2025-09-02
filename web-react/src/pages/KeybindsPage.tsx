import "./KeybindsPage.css";

export function KeybindsPage() {
  return (
    <div className="keybinds-page">
      <div className="keybinds-row">
        <label className="keybind-label">Start / Pause</label>
        <span className="keybind">Space</span>
      </div>
      <div className="keybinds-row">
        <label className="keybind-label">Reset</label>
        <span className="keybind">R</span>
      </div>
      <div className="keybinds-row">
        <label className="keybind-label">Switch timer Mode</label>
        <span className="keybind">w</span>
        <span className="keybind">W</span>
      </div>
      <div className="keybinds-row">
        <label className="keybind-label">Fullscreen view</label>
        <span className="keybind">f</span>
        <span className="keybind">F</span>
      </div>
    </div>
  );
}
