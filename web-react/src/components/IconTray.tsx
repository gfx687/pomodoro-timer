import "./IconTray.css";
import { useWebSocketConnection } from "../hooks/useWebSocketConnection";
import { useSettingsContext } from "../contexts/SettingsContext";
import { ConnectedSvg, DisconnectedSvg, MutedSvg } from "./svgs";

export function IconTray() {
  const { isConnected } = useWebSocketConnection();
  const { volume } = useSettingsContext();

  return (
    <>
      {volume === 0 && (
        <div title="Alerts are muted." className="icon-tray">
          <MutedSvg />
        </div>
      )}
      {!isConnected && (
        <div title="Sync is OFF." className="icon-tray">
          <DisconnectedSvg />
        </div>
      )}
      {isConnected && (
        <div title="Sync is ON." className="icon-tray">
          <ConnectedSvg />
        </div>
      )}
    </>
  );
}
