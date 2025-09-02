/// <param name="IsActive">Is Ticking / Unpaused?</param>
/// <param name="ExpiresAt">`null` if the timer is Paused</param>
public record TimerStatus(
    Guid Id,
    bool IsActive,
    int RemainingS,
    DateTimeOffset? ExpiresAt,
    TimerModes Mode,
    DateTimeOffset StartedAt
)
{
    public static TimerStatus FromState(TimerState state, DateTimeOffset now) =>
        new(
            state.Id,
            state.IsActive,
            state.GetRemaining(now),
            state.ExpiresAt,
            state.Mode,
            state.StartedAt
        );
}
