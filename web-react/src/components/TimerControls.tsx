import {
  isAnActiveStatus,
  type TimerStatus,
} from "../hooks/useTimerState.reducer";
import "./TimerControls.css";

interface TimerControlsProps {
  timerStatus: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export default function TimerControls({
  timerStatus,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  const drawStart = !isAnActiveStatus(timerStatus);
  const drawResume = timerStatus == "paused";
  const drawPause = timerStatus == "ticking";
  const drawReset = timerStatus != "no timer";

  return (
    <div className="timer-controls">
      {drawStart && (
        <button
          type="button"
          tabIndex={1}
          className="timer-control"
          onClick={onStart}
        >
          Start
        </button>
      )}
      {drawPause && (
        <button type="button" className="timer-control" onClick={onPause}>
          Pause
        </button>
      )}
      {drawResume && (
        <button type="button" className="timer-control" onClick={onResume}>
          Resume
        </button>
      )}
      {drawReset && (
        <button
          type="button"
          className="timer-reset"
          onClick={onReset}
          title="Reset the timer"
        >
          <div className="timer-reset-center-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
