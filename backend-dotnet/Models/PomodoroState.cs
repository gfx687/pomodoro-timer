public class PomodoroState
{
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
        IsActive = false;
        ElapsedBeforePause += (int)DateTimeOffset.UtcNow.Subtract(LastUnpausedAt).TotalSeconds;
    }

    public void Unpause()
    {
        IsActive = true;
        LastUnpausedAt = DateTimeOffset.UtcNow;
    }
}
