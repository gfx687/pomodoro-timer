import { useSettingsContext } from "../contexts/SettingsContext";
import "./Timer.css";

type TimerProps = {
  remainingS: number;
  isFullscreen: boolean;
};

export default function Timer({ remainingS, isFullscreen }: TimerProps) {
  const { inverseColorsFullscreen } = useSettingsContext();
  if (isFullscreen) {
    return (
      <div
        className={
          "timer-fullscreen" + (inverseColorsFullscreen ? " inverse" : "")
        }
      >
        {formatSeconds(remainingS)}
      </div>
    );
  }

  const fontSize = {
    fontSize: remainingS <= 3600 ? "144px" : "96px",
  };

  return (
    <div style={fontSize} className="timer">
      {formatSeconds(remainingS)}
    </div>
  );
}

/**
 * Format seconds into "HH:MM:SS" (if hours>0) or "MM:SS" (if hours===0).
 * Minutes and seconds are always zero-padded to two digits.
 */
function formatSeconds(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  const pad2 = (n: number) => String(n).padStart(2, "0");

  if (totalSeconds === 3600) {
    return `60:00`;
  } else if (hours > 0) {
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  } else {
    return `${pad2(minutes)}:${pad2(seconds)}`;
  }
}
