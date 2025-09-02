using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TimerLogActions
{
    Start = 1,
    Pause = 2,
    Unpause = 3,
    Finish = 4,
    Reset = 5,
}

public class TimerLog
{
    // for EF Core tracking
    public int PrimaryKey { get; private set; }
    public Guid Id { get; private set; }
    public TimerLogActions Action { get; private set; }
    public DateTimeOffset Timestamp { get; private set; }
    public TimerModes? Mode { get; private set; }
    public int? DurationTotal { get; private set; }

    /// <summary>
    /// Normally should be equal to <see cref="DurationTotal"/>,
    /// but if the frontend had no backend connection at the time of the Timer creation
    /// then it will create it once available with this field up-to-date
    /// </summary>
    public int? RemainingAtCreationTime { get; private set; }

    // EF Core ctor
    private TimerLog() { }

    public TimerLog(
        Guid id,
        TimerLogActions action,
        DateTimeOffset timestamp,
        TimerModes? mode = null,
        int? durationTotal = null,
        int? remainingAtCreationTime = null
    )
    {
        if (action == TimerLogActions.Start)
        {
            if (!mode.HasValue)
            {
                throw new ArgumentNullException(nameof(mode));
            }
            if (!durationTotal.HasValue)
            {
                throw new ArgumentNullException(nameof(durationTotal));
            }

            remainingAtCreationTime ??= durationTotal;
        }

        Id = id;
        Action = action;
        Timestamp = timestamp;
        Mode = mode;
        DurationTotal = durationTotal;
        RemainingAtCreationTime = remainingAtCreationTime;
    }
}
