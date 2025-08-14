public record PomodoroStatus(
    bool IsActive,
    int RemainingS,
    PomodoroModes Mode,
    DateTimeOffset StartedAt
)
{
    public static PomodoroStatus FromState(PomodoroState state) =>
        new(state.IsActive, state.GetRemaining(), state.Mode, state.StartedAt);
}
