public class TimerManager
{
    TimerState? _state;

    public TimrerStatus? Get()
    {
        if (_state == null || _state?.GetRemaining() <= 0)
            return null;

        return TimrerStatus.FromState(_state!);
    }

    /// <summary>
    /// If timer does not exist will create one with the provided params
    /// If already exists will return the existing one
    /// </summary>
    public (TimrerStatus status, bool alreadyExists) Start(TimerStartRequestPayload payload)
    {
        bool alreadyExists = true;
        var remaining = _state?.GetRemaining();
        if (_state == null || remaining <= 0)
        {
            _state = new TimerState(
                payload.DurationTotal,
                payload.Mode,
                payload.StartedAt ?? DateTimeOffset.Now,
                payload.Remaining ?? payload.DurationTotal
            );
            alreadyExists = false;
        }

        return (TimrerStatus.FromState(_state), alreadyExists);
    }

    public TimrerStatus? Unpause()
    {
        if (_state == null || _state.GetRemaining() <= 0)
            return null;

        _state.Unpause();

        return TimrerStatus.FromState(_state);
    }

    public TimrerStatus? Pause()
    {
        if (_state == null || _state.GetRemaining() <= 0)
            return null;

        _state.Pause();

        return TimrerStatus.FromState(_state);
    }

    public void Reset()
    {
        _state = null;
    }
}
