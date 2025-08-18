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

    public TimerState(
        Guid id,
        int durationTotal,
        TimerModes mode,
        DateTimeOffset startedAt,
        int remaining,
        DateTimeOffset lastUnpausedAt
    )
    {
        if (durationTotal <= 0)
            throw new ArgumentException($"{nameof(durationTotal)} must be more than 0");
        if (remaining <= 0)
            throw new ArgumentException($"{nameof(remaining)} must be more than 0");

        Id = id;
        IsActive = true;
        StartedAt = startedAt;
        DurationTotal = durationTotal;
        LastUnpausedAt = lastUnpausedAt;
        ElapsedBeforePause = durationTotal - remaining;
        Mode = mode;
    }

    public int GetRemaining(DateTimeOffset now)
    {
        var remaining = DurationTotal - ElapsedBeforePause;

        if (IsActive)
        {
            var passed = (int)now.Subtract(LastUnpausedAt).TotalSeconds;
            remaining -= passed;
        }
        return remaining;
    }

    public void Pause(DateTimeOffset now)
    {
        if (!IsActive)
            return;

        IsActive = false;
        ElapsedBeforePause += (int)now.Subtract(LastUnpausedAt).TotalSeconds;
    }

    public void Unpause(DateTimeOffset now)
    {
        if (IsActive)
            return;

        IsActive = true;
        LastUnpausedAt = now;
    }
}
