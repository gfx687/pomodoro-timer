import { formatTimerSeconds } from "../utils/formatTimerSeconds";

interface TimerProps {
  remainingS: number;
}

export default function Timer({ remainingS }: TimerProps) {
  const fontSize = {
    fontSize: remainingS <= 3600 ? "168px" : "108px",
  };

  return <div style={fontSize}>{formatTimerSeconds(remainingS)}</div>;
}
