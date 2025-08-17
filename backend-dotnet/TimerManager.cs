public class TimerManager(IServiceProvider _services)
{
    TimerState? _state;

    public TimerStatus? Get()
    {
        if (_state == null || _state?.GetRemaining() <= 0)
            return null;

        return TimerStatus.FromState(_state!);
    }

    /// <summary>
    /// If timer does not exist will create one with the provided parameters
    /// If already exists will return the existing one
    /// </summary>
    public async Task<(TimerStatus status, bool alreadyExists)> Start(
        TimerStartRequestPayload payload
    )
    {
        var remaining = _state?.GetRemaining();
        if (_state == null || remaining <= 0)
        {
            await using var scope = _services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<TimerDbContext>();
            var log = new TimerLog(
                payload.Id ?? Guid.NewGuid(),
                TimerLogActions.Start,
                payload.StartedAt,
                payload.Mode,
                payload.DurationTotal,
                payload.Remaining
            );
            await db.TimerLogs.AddAsync(log);
            await db.SaveChangesAsync();

            _state = new TimerState(
                log.Id,
                payload.DurationTotal,
                payload.Mode,
                log.Timestamp,
                payload.Remaining ?? payload.DurationTotal
            );
            return (TimerStatus.FromState(_state), false);
        }

        return (TimerStatus.FromState(_state), true);
    }

    public async Task<TimerStatus?> Unpause(Guid id)
    {
        if (_state != null && _state.Id != id)
            throw new IncorrectTimerIdException();

        if (_state == null || _state.GetRemaining() <= 0)
            return null;

        await using var scope = _services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<TimerDbContext>();
        await db.TimerLogs.AddAsync(new TimerLog(id, TimerLogActions.Unpause));
        await db.SaveChangesAsync();

        _state.Unpause();

        return TimerStatus.FromState(_state);
    }

    public async Task<TimerStatus?> Pause(Guid id)
    {
        if (_state != null && _state.Id != id)
            throw new IncorrectTimerIdException();

        if (_state == null || _state.GetRemaining() <= 0)
            return null;

        await using var scope = _services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<TimerDbContext>();
        await db.TimerLogs.AddAsync(new TimerLog(id, TimerLogActions.Pause));
        await db.SaveChangesAsync();

        _state.Pause();

        return TimerStatus.FromState(_state);
    }

    public async Task Reset(Guid id)
    {
        if (_state != null && _state.Id != id)
            throw new IncorrectTimerIdException();

        await using var scope = _services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<TimerDbContext>();
        await db.TimerLogs.AddAsync(new TimerLog(id, TimerLogActions.Reset));
        await db.SaveChangesAsync();

        _state = null;
    }
}
