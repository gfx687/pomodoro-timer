public class TimerState
{
    public Guid Id { get; private set; }

    /// <summary>
    /// Refers to pause / unpause, not general existence of a timer
    /// </summary>
    public bool IsActive { get; private set; }
    public DateTimeOffset StartedAt { get; private set; }
    public int DurationTotal { get; private set; }
    public DateTimeOffset LastUnpausedAt { get; private set; }
    public int ElapsedBeforePause { get; private set; }
    public TimerModes Mode { get; private set; }

    public TimerState(int durationTotal, TimerModes mode)
    {
        IsActive = true;
        StartedAt = DateTimeOffset.UtcNow;
        DurationTotal = durationTotal;
        LastUnpausedAt = StartedAt;
        ElapsedBeforePause = 0;
        Mode = mode;
    }

    public TimerState(
        Guid id,
        int durationTotal,
        TimerModes mode,
        DateTimeOffset startedAt,
        int remaining
    )
    {
        Id = id;
        IsActive = true;
        StartedAt = startedAt;
        DurationTotal = durationTotal;
        LastUnpausedAt = DateTimeOffset.UtcNow;
        ElapsedBeforePause = durationTotal - remaining;
        Mode = mode;
    }

    public int GetRemaining()
    {
        var remaining = DurationTotal - ElapsedBeforePause;

        if (IsActive)
        {
            var passed = (int)DateTimeOffset.UtcNow.Subtract(LastUnpausedAt).TotalSeconds;
            remaining -= passed;
        }
        return remaining;
    }

    public void Pause()
    {
        if (!IsActive)
            return;

        IsActive = false;
        ElapsedBeforePause += (int)DateTimeOffset.UtcNow.Subtract(LastUnpausedAt).TotalSeconds;
    }

    public void Unpause()
    {
        if (IsActive)
            return;

        IsActive = true;
        LastUnpausedAt = DateTimeOffset.UtcNow;
    }
}
