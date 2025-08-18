public record TimerStatus(
    Guid Id,
    bool IsActive,
    int RemainingS,
    TimerModes Mode,
    DateTimeOffset StartedAt
)
{
    public static TimerStatus FromState(TimerState state, DateTimeOffset now) =>
        new(state.Id, state.IsActive, state.GetRemaining(now), state.Mode, state.StartedAt);
}
