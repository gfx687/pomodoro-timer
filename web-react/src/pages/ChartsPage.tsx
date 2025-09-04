import "./ChartsPage.css";
import { useQuery } from "@tanstack/react-query";
import TodaysTimers from "../dataviz/TodaysTimers";
import { format } from "date-fns";
import { useState, type ChangeEvent } from "react";
import type { ChartDataResponse } from "../other/types.api";
import { TimerLogList } from "../components/TimerLogList";

export default function ChartsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const { data, isSuccess, isError, isPending } = useQuery<
    ChartDataResponse,
    Error,
    ChartDataResponse,
    [string]
  >({
    queryKey: [selectedDate],
    queryFn: async ({ queryKey }) => {
      const [selectedDate] = queryKey;
      return await fetchChartData(selectedDate);
    },
  });

  return (
    <div className="charts-page">
      <label htmlFor="chart-data-from">Pick date: </label>
      <input
        type="date"
        name="chart-data-from"
        id="chart-data-from"
        value={selectedDate}
        onChange={handleDateChange}
        max={getTodayString()}
      />
      {isPending && <p>Fetching...</p>}
      {isError && <p>ERROR: something went wrong</p>}
      {isSuccess && (
        <>
          <p>
            Note: The chart only shows 'Work' type timers that were Finished.
          </p>
          <TodaysTimers data={data!.processed} />
          <TimerLogList logs={data!.raw} />
        </>
      )}
    </div>
  );
}

// 2025-08-31
function getTodayString() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

async function fetchChartData(selectedDate: string) {
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const response = await fetch(
    import.meta.env.VITE_API_URL +
      "/api/timers/chart-day?" +
      new URLSearchParams({ from: format(selected, "yyyy-MM-ddxxx") })
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
