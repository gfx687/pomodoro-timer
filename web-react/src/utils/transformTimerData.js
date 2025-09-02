/**
 * Transforms backend timer data into Google Charts timeline format
 * @param {Array} backendData - Array of timer actions from API
 * @returns {Array} Google Charts format data
 */
export function transformTimerDataToChart(backendData) {
  if (!backendData || backendData.length === 0) {
    return [[{ type: "string", id: "Day" }], []];
  }

  // Parse timestamps and sort by time
  const events = backendData
    .map((event) => ({
      ...event,
      timestamp: new Date(event.timestamp),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Group by date
  const dateGroups = {};
  events.forEach((event) => {
    const dateKey = event.timestamp.toISOString().split("T")[0];
    if (!dateGroups[dateKey]) {
      dateGroups[dateKey] = [];
    }
    dateGroups[dateKey].push(event);
  });

  // Process each date
  const chartData = [];
  const headers = [{ type: "string", id: "Day" }];

  Object.entries(dateGroups).forEach(([date, dayEvents]) => {
    const timeSlots = [];
    let currentSession = null;
    let sessionIndex = 0;

    // Process events to build timeline segments
    for (let i = 0; i < dayEvents.length; i++) {
      const event = dayEvents[i];

      if (event.action === "Start" && event.mode) {
        // End previous session if exists
        if (currentSession) {
          const duration =
            (event.timestamp - currentSession.startTime) / (1000 * 60); // minutes
          timeSlots.push({
            mode: currentSession.mode,
            duration: Math.max(1, Math.round(duration)), // minimum 1 minute
            index: sessionIndex++,
            tooltip: `${currentSession.mode}: ${formatDuration(duration)}`,
          });
        }

        // Start new session
        currentSession = {
          mode: event.mode,
          startTime: event.timestamp,
        };
      } else if (event.action === "Pause" || event.action === "Reset") {
        // End current session
        if (currentSession) {
          const duration =
            (event.timestamp - currentSession.startTime) / (1000 * 60); // minutes
          timeSlots.push({
            mode: currentSession.mode,
            duration: Math.max(1, Math.round(duration)), // minimum 1 minute
            index: sessionIndex++,
            tooltip: `${currentSession.mode}: ${formatDuration(duration)}`,
          });
          currentSession = null;
        }
      }
    }

    // Handle ongoing session (assume default durations)
    if (currentSession) {
      const defaultDuration = currentSession.mode === "Work" ? 25 : 5; // Pomodoro defaults
      timeSlots.push({
        mode: currentSession.mode,
        duration: defaultDuration,
        index: sessionIndex++,
        tooltip: `${currentSession.mode}: ${formatDuration(
          defaultDuration
        )} (ongoing)`,
      });
    }

    // Build chart row for this date
    if (timeSlots.length > 0) {
      // Build headers dynamically based on sessions
      const maxIndex = Math.max(...timeSlots.map((slot) => slot.index));
      while (headers.length < (maxIndex + 1) * 2 + 1) {
        const headerIndex = Math.floor((headers.length - 1) / 2);
        const modeType =
          timeSlots
            .find((slot) => slot.index === headerIndex)
            ?.mode.toLowerCase() || "work";
        headers.push(
          { type: "number", id: `${modeType}_${headerIndex}` },
          { type: "string", role: "tooltip" }
        );
      }

      // Build data row
      const row = [date];
      for (let i = 0; i <= maxIndex; i++) {
        const slot = timeSlots.find((s) => s.index === i);
        if (slot) {
          row.push(slot.duration, slot.tooltip);
        } else {
          row.push(0, "");
        }
      }

      chartData.push(row);
    }
  });

  return [headers, ...chartData];
}

/**
 * Format duration in minutes to human readable string
 * @param {number} minutes
 * @returns {string}
 */
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}
