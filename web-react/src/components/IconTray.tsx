import { useWebSocketConnection } from "../hooks/useWebSocketConnection";
import { useSettingsContext } from "../contexts/SettingsContext";
import { ConnectedSvg, DisconnectedSvg, MutedSvg } from "./svgs";

export function IconTray() {
  const { isConnected } = useWebSocketConnection();
  const { volume } = useSettingsContext();

  return (
    <>
      {volume === 0 && (
        <div title="Alerts are muted." className="flex items-center">
          <MutedSvg />
        </div>
      )}
      {!isConnected && (
        <div title="Sync is OFF." className="flex items-center">
          <DisconnectedSvg />
        </div>
      )}
      {isConnected && (
        <div title="Sync is ON." className="flex items-center">
          <ConnectedSvg />
        </div>
      )}
    </>
  );
}
