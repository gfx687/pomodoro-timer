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
        <label className="keybind-label">Fullscreen view</label>
        <span className="keybind">f</span>
        <span className="keybind">F</span>
      </div>
      <div className="keybinds-row">
        <label className="keybind-label">Switch to Work mode</label>
        <span className="keybind">1</span>
      </div>
      <div className="keybinds-row">
        <label className="keybind-label">Switch to Break mode</label>
        <span className="keybind">2</span>
      </div>
      <div className="keybinds-row">
        <label className="keybind-label">Switch to Long Break mode</label>
        <span className="keybind">3</span>
      </div>
    </div>
  );
}
