public class TimerState
{
    public Guid Id { get; init; }

    /// <summary>
    /// Refers to pause / unpause, not general existence of a timer
    /// </summary>
    public bool IsActive { get; private set; }
    public DateTimeOffset? ExpiresAt { get; private set; }
    public int? RemainingOnPauseMs { get; private set; }
    public string? SchedulerJobId { get; set; }

    public DateTimeOffset StartedAt { get; init; }
    public int DurationTotalS { get; init; }
    public TimerModes Mode { get; init; }

    public TimerState(
        Guid id,
        bool isActive,
        int durationTotal,
        TimerModes mode,
        DateTimeOffset startedAt,
        int remainingOnPauseS,
        DateTimeOffset now
    )
    {
        if (durationTotal <= 0)
            throw new ArgumentException($"{nameof(durationTotal)} must be more than 0");
        if (remainingOnPauseS <= 0 || remainingOnPauseS > durationTotal)
            throw new ArgumentException(
                $"{nameof(remainingOnPauseS)} must be > 0 and <= durationTotal"
            );

        Id = id;
        IsActive = isActive;
        DurationTotalS = durationTotal;
        Mode = mode;
        StartedAt = startedAt;
        ExpiresAt = now.AddSeconds(remainingOnPauseS);
        RemainingOnPauseMs = remainingOnPauseS * 1000;
    }

    public int GetRemaining(DateTimeOffset now)
    {
        if (IsActive)
            return Convert.ToInt32(ExpiresAt!.Value.Subtract(now).TotalSeconds);

        return Convert.ToInt32(RemainingOnPauseMs!.Value / 1000.0);
    }

    public void Pause(DateTimeOffset now)
    {
        if (!IsActive)
            return;

        IsActive = false;
        RemainingOnPauseMs = Convert.ToInt32(ExpiresAt!.Value.Subtract(now).TotalMilliseconds);
        ExpiresAt = null;
    }

    public void Unpause(DateTimeOffset now)
    {
        if (IsActive)
            return;

        IsActive = true;
        ExpiresAt = now.AddMilliseconds(RemainingOnPauseMs!.Value);
        RemainingOnPauseMs = null;
    }
}
