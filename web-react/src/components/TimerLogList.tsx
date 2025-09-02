import { format } from "date-fns";
import type { TimerLog } from "../other/types.api";

interface TimerLogListProps {
  logs: TimerLog[];
}

export function TimerLogList({ logs }: TimerLogListProps) {
  const { mapped, workStarted, workFinished } = mapLogs(logs);

  if (logs.length === 0) return <div>No logs the this day</div>;

  return (
    <>
      <p style={{ textAlign: "center" }}>
        'Work' timers started: {workStarted}, finished: {workFinished}
      </p>
      <p>Raw timer actions log:</p>
      <ul>
        {mapped.map((x) => (
          <li key={`${x.id}-${x.timestamp}`}>
            <span
              style={{
                backgroundColor:
                  x.mode === "Work" && x.action == "Start" ? "#ffb070ff" : "",
              }}
            >
              {format(x.timestamp, "HH:mm")} - {x.mode} #{x.timerId} -{" "}
              {x.action}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function mapLogs(logs: TimerLog[]) {
  if (logs.length === 0) return { mapped: [], workStarted: 0, workFinished: 0 };

  let lastTimer = logs[0];
  let timerIdx = 1;

  let workStarted = 0;
  let workFinished = 0;

  const mapped = logs.map((x) => {
    if (lastTimer.id != x.id) {
      lastTimer = x;
      timerIdx++;
    }

    if (x.mode === "Work") {
      if (x.action === "Start") workStarted++;
      if (x.action === "Finish") workFinished++;
    }

    return {
      ...x,
      timerId: timerIdx,
      mode: x.mode === null ? lastTimer.mode : x.mode,
    };
  });

  return { mapped, workStarted, workFinished };
}
