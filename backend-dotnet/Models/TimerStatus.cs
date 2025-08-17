public record TimerStatus(
    Guid Id,
    bool IsActive,
    int RemainingS,
    TimerModes Mode,
    DateTimeOffset StartedAt
)
{
    public static TimerStatus FromState(TimerState state) =>
        new(state.Id, state.IsActive, state.GetRemaining(), state.Mode, state.StartedAt);
}
