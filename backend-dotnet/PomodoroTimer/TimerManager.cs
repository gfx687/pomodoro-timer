public interface ITimerManager
{
    TimerStatus? Get();
    TimerStatus? Pause(Guid id);
    void Reset(Guid id);
    (TimerStatus status, bool alreadyExists) Start(Guid id, TimerStartRequestPayload payload);
    TimerStatus? Unpause(Guid id);
}

public class TimerManager(ISystemClock _clock) : ITimerManager
{
    TimerState? _state;

    public TimerStatus? Get()
    {
        if (_state == null || _state?.GetRemaining(_clock.UtcNow) <= 0)
            return null;

        return TimerStatus.FromState(_state!, _clock.UtcNow);
    }

    /// <summary>
    /// If timer does not exist will create one with the provided parameters
    /// If already exists will return the existing one
    /// </summary>
    public (TimerStatus status, bool alreadyExists) Start(Guid id, TimerStartRequestPayload payload)
    {
        if (_state != null && _state?.GetRemaining(_clock.UtcNow) >= 0)
            return (TimerStatus.FromState(_state, _clock.UtcNow), true);

        _state = new TimerState(
            id,
            payload.DurationTotal,
            payload.Mode,
            payload.StartedAt ?? _clock.UtcNow,
            payload.Remaining ?? payload.DurationTotal,
            _clock.UtcNow
        );
        return (TimerStatus.FromState(_state, _clock.UtcNow), false);
    }

    public TimerStatus? Unpause(Guid id)
    {
        if (_state != null && _state.Id != id)
            throw new IncorrectTimerIdException();

        if (_state == null || _state.GetRemaining(_clock.UtcNow) <= 0)
            return null;

        _state.Unpause(_clock.UtcNow);

        return TimerStatus.FromState(_state, _clock.UtcNow);
    }

    public TimerStatus? Pause(Guid id)
    {
        if (_state != null && _state.Id != id)
            throw new IncorrectTimerIdException();

        if (_state == null || _state.GetRemaining(_clock.UtcNow) <= 0)
            return null;

        _state.Pause(_clock.UtcNow);

        return TimerStatus.FromState(_state, _clock.UtcNow);
    }

    public void Reset(Guid id)
    {
        if (_state != null && _state.Id != id)
            throw new IncorrectTimerIdException();

        _state = null;
    }
}
