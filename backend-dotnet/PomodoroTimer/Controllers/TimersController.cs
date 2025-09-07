using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Serilog;

public record TimerLogDto(
    Guid Id,
    TimerLogActions Action,
    TimerModes? Mode,
    DateTimeOffset Timestamp
);

[ApiController]
[Route("api/[controller]")]
public class TimersController(ITimerLogRepository _timerLogs) : ControllerBase
{
    /// <summary>
    /// Client should send the date with an offset (timezone) for correct data and tooltips. <br/><br/>
    /// Returns the data for ONE day
    /// example: `?from=2025-08-25T00:00:00-03:00`    for -3h timezone. <br/>
    /// example: `?from=2025-08-25%2B02:00`  for +2h timezone.
    /// </summary>
    [HttpGet("chart-day")]
    public async Task<ActionResult<object>> Get([BindRequired] DateTimeOffset from)
    {
        try
        {
            var todayLogs = await _timerLogs.GetDaysLogsAsync(from);

            // - group logs by timer ID
            // - remove any non-Work modes
            // - remove non-Finished timers
            var filtered = todayLogs
                .GroupBy(x => x.Id)
                .Where(x =>
                    x.First().Mode == TimerModes.Work
                    && x.Any(y => y.Action == TimerLogActions.Finish)
                )
                .SelectMany(group => group.OrderBy(x => x.Timestamp))
                .ToList();

            var (headers, dataRow) = PrepareChartData(filtered, from);
            return new
            {
                Raw = todayLogs.Select((x) => new TimerLogDto(x.Id, x.Action, x.Mode, x.Timestamp)),
                Processed = new object[] { headers, dataRow },
            };
        }
        catch (Exception ex)
        {
            Log.Logger.Error(ex, "something went wrong");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "An unexpected error occurred. Please try again later."
            );
        }
    }

    /// <summary>
    /// Only handles a single day's logs
    /// </summary>
    /// <returns>Headers and a single Row</returns>
    public static (List<ChartHeader>, List<string>) PrepareChartData(
        List<TimerLog> logs,
        DateTimeOffset from
    )
    {
        var headers = new List<ChartHeader> { ChartHeader.DataPoint("string", "Day") };
        var data = new List<string> { from.ToString("d") };

        if (logs.Count == 0)
            return ([.. headers, ChartHeader.DataPoint("number", $"Empty_0")], [.. data, "0"]);

        var lastLogAction = TimerLogActions.Reset;
        var lastLogTimestamp = new DateTimeOffset(from.Date, from.Offset);
        var currentMinute = 0;
        for (int i = 0; i < logs.Count; i++)
        {
            TimerLog? log = logs[i];
            var timestamp = log.Timestamp.ToOffset(from.Offset);
            var currentMinuteNext = Convert.ToInt32(timestamp.Subtract(from).TotalMinutes);

            // TODO: edge case - next timestamp is earlier than previous one
            var periodDuration = currentMinuteNext - currentMinute;
            currentMinute = currentMinuteNext;

            var periodType = lastLogAction switch
            {
                TimerLogActions.Finish => "Break",
                TimerLogActions.Reset => "Break",
                TimerLogActions.Pause => "Pause",
                _ => "Work",
            };

            headers.Add(ChartHeader.DataPoint("number", $"{periodType}_{i}"));
            headers.Add(ChartHeader.Tooltip());

            data.Add(periodDuration.ToString());
            data.Add(
                @$"{periodType}: {periodDuration} min

Started at {lastLogTimestamp:t}
Finished at {timestamp:t}"
            );

            lastLogAction = log.Action;
            lastLogTimestamp = timestamp;
        }

        return (headers, data);
    }
}

public record ChartHeader
{
    public required string Type { get; init; }
    public string? Id { get; init; }
    public string? Role { get; init; }

    public static ChartHeader DataPoint(string type, string id) => new() { Type = type, Id = id };

    public static ChartHeader Tooltip() => new() { Type = "string", Role = "tooltip" };
}
