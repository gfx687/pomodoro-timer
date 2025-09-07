/* eslint-disable @typescript-eslint/no-explicit-any */
import { Chart, type ChartWrapperOptions } from "react-google-charts";
import type { ChartData } from "../other/types.api";

export interface TodaysTimersProps {
  data: ChartData;
}

function TodaysTimers({ data }: TodaysTimersProps) {
  const headers = data[0];
  const bgColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg")
    .trim();

  const seriesOptions = {} as Record<number, any>;
  let seriesIndex = 0;
  headers.slice(1).forEach((header: any) => {
    if (header.id) {
      let color = "transparent";
      if (header.id.startsWith("Work_")) color = "#fd7e14";
      if (header.id.startsWith("Pause")) color = "#aaa";
      seriesOptions[seriesIndex] = {
        color: color,
      };
      seriesIndex++;
    }
  });

  const options = {
    isStacked: true,
    legend: { position: "none" },
    series: seriesOptions,
    backgroundColor: bgColor,
    orientation: "vertical",
    hAxis: {
      ticks: [
        { v: 0, f: "6:00" },
        { v: 120, f: "8:00" },
        { v: 240, f: "10:00" },
        { v: 360, f: "12:00" },
        { v: 480, f: "14:00" },
        { v: 600, f: "16:00" },
        { v: 720, f: "18:00" },
        { v: 840, f: "20:00" },
        { v: 960, f: "22:00" },
        { v: 1080, f: "0:00" },
        { v: 1200, f: "2:00" },
        { v: 1320, f: "4:00" },
        { v: 1440, f: "6:00" },
      ] as any[],
    },
    explorer: {
      axis: "horizontal",
      keepInBounds: true,
      maxZoomIn: 4,
      maxZoomOut: 1,
    },
  } as ChartWrapperOptions["options"];

  return (
    <Chart
      chartType="ColumnChart"
      data={data}
      options={options}
      height={"200px"}
      width={"100%"}
    />
  );
}

export default TodaysTimers;
