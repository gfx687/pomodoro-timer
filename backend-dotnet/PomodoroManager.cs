public class PomodoroManager
{
    PomodoroState? _state;

    public PomodoroStatus? Get()
    {
        if (_state == null)
            return null;

        var remaining = _state.GetRemaining();
        return remaining <= 0 ? null : new(_state.IsActive, remaining, _state.Mode);
    }

    /// <summary>
    /// Also acts as Unpause.
    /// </summary>
    public PomodoroStatus Start(int duration, PomodoroModes mode)
    {
        if (_state == null)
        {
            _state = new PomodoroState(duration, mode);
            return new(_state.IsActive, _state.GetRemaining(), _state.Mode);
        }

        var remaining = _state.GetRemaining();
        if (remaining <= 0 || _state.Mode != mode)
        {
            _state = new PomodoroState(duration, mode);
            return new(_state.IsActive, _state.GetRemaining(), _state.Mode);
        }

        if (!_state.IsActive)
        {
            _state.Unpause();
        }

        return new(_state.IsActive, _state.GetRemaining(), _state.Mode);
    }

    public PomodoroStatus? Pause()
    {
        if (_state == null)
            return null;

        var remaining = _state.GetRemaining();
        if (remaining <= 0)
            return null;

        if (!_state.IsActive)
            return new(_state.IsActive, _state.GetRemaining(), _state.Mode);

        _state.Pause();
        return new(_state.IsActive, _state.GetRemaining(), _state.Mode);
    }

    public void Reset()
    {
        _state = null;
    }
}
