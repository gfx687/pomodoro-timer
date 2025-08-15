public record TimrerStatus(bool IsActive, int RemainingS, TimerModes Mode, DateTimeOffset StartedAt)
{
    public static TimrerStatus FromState(TimerState state) =>
        new(state.IsActive, state.GetRemaining(), state.Mode, state.StartedAt);
}
