import type { TimerMode } from "../other/types.websocket";
import { formatTimerSeconds } from "../utils/formatTimerSeconds";
import { useSettingsContext } from "../contexts/SettingsContext";

export interface TimerFullscreenProps {
  remainingS: number;
  mode: TimerMode;
  isPaused: boolean;
}

export function TimerFullscreen({
  remainingS,
  mode,
  isPaused,
}: TimerFullscreenProps) {
  const { inverseColorsFullscreen, fullscreenShowMode } = useSettingsContext();
  return (
    <div
      className={
        "visible fixed top-0 left-0 m-auto flex h-[100vh] w-[100vw] flex-col justify-center" +
        (inverseColorsFullscreen ? " text-bg bg-fg" : "text-fg bg-bg")
      }
    >
      <div className={isPaused ? "opacity-25" : ""}>
        <div className="relative text-[30vw]">
          {formatTimerSeconds(remainingS)}
        </div>
        {fullscreenShowMode && <div className="text-[3vw]">{mode}</div>}
      </div>
      {isPaused && (
        <div className="fixed top-1/2 left-1/2 flex h-[15vw] w-[15vw] -translate-1/2 items-center justify-center rounded-full border-[0.75vw] border-current bg-inherit opacity-100">
          <div className="flex gap-[2vw]">
            <div className="h-[8vw] w-[2vw] rounded-[0.5vw] bg-current"></div>
            <div className="h-[8vw] w-[2vw] rounded-[0.5vw] bg-current"></div>
          </div>
        </div>
      )}
    </div>
  );
}
