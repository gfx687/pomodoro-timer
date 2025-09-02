import { formatTimerSeconds } from "../utils/formatTimerSeconds";
import "./Timer.css";

interface TimerProps {
  remainingS: number;
}

export default function Timer({ remainingS }: TimerProps) {
  const fontSize = {
    fontSize: remainingS <= 3600 ? "144px" : "96px",
  };

  return (
    <div style={fontSize} className="timer">
      {formatTimerSeconds(remainingS)}
    </div>
  );
}
