public class PomodoroState
{
    /// <summary>
    /// Refers to pause / unpause, not general existence of a timer
    /// </summary>
    public bool IsActive { get; private set; }
    public DateTimeOffset StartedAt { get; private set; }
    public int DurationTotal { get; private set; }
    public DateTimeOffset LastUnpausedAt { get; private set; }
    public int ElapsedBeforePause { get; private set; }
    public PomodoroModes Mode { get; private set; }

    public PomodoroState(int durationTotal, PomodoroModes mode)
    {
        IsActive = true;
        StartedAt = DateTimeOffset.UtcNow;
        DurationTotal = durationTotal;
        LastUnpausedAt = StartedAt;
        ElapsedBeforePause = 0;
        Mode = mode;
    }

    public PomodoroState(
        int durationTotal,
        PomodoroModes mode,
        DateTimeOffset startedAt,
        int remaining
    )
    {
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
