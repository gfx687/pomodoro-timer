public class PomodoroManager
{
    PomodoroState? _state;

    public PomodoroStatus? Get()
    {
        if (_state == null || _state?.GetRemaining() <= 0)
            return null;

        return PomodoroStatus.FromState(_state!);
    }

    /// <summary>
    /// If timer does not exist will create one with the provided params
    /// If already exists will return the existing one
    /// </summary>
    public (PomodoroStatus status, bool alreadyExists) Start(TimerStartRequestPayload payload)
    {
        bool alreadyExists = true;
        var remaining = _state?.GetRemaining();
        if (_state == null || remaining <= 0)
        {
            _state = new PomodoroState(
                payload.DurationTotal,
                payload.Mode,
                payload.StartedAt ?? DateTimeOffset.Now,
                payload.Remaining ?? payload.DurationTotal
            );
            alreadyExists = false;
        }

        return (PomodoroStatus.FromState(_state), alreadyExists);
    }

    public PomodoroStatus? Unpause()
    {
        if (_state == null || _state.GetRemaining() <= 0)
            return null;

        _state.Unpause();

        return PomodoroStatus.FromState(_state);
    }

    public PomodoroStatus? Pause()
    {
        if (_state == null || _state.GetRemaining() <= 0)
            return null;

        _state.Pause();

        return PomodoroStatus.FromState(_state);
    }

    public void Reset()
    {
        _state = null;
    }
}
