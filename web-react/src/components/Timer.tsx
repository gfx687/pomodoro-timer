import { formatTimerSeconds } from "../utils/formatTimerSeconds";
import "./Timer.css";

interface TimerProps {
  remainingS: number;
}

export default function Timer({ remainingS }: TimerProps) {
  const fontSize = {
    fontSize: remainingS <= 3600 ? "168px" : "108px",
  };

  return (
    <div style={fontSize} className="timer">
      {formatTimerSeconds(remainingS)}
    </div>
  );
}
