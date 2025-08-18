namespace PomodoroTimer.MessageHandlers;

public class TimerResetMessageHandler(
    ITimerManager _manager,
    ITimerLogRepository _db,
    ISystemClock _clock
)
{
    public async Task<SocketResponse> HandleAsync(TimerResetRequest req, CancellationToken ct)
    {
        try
        {
            _manager.Reset(req.Payload.Id);
            await _db.SaveLogAsync(
                new TimerLog(req.Payload.Id, TimerLogActions.Reset, _clock.UtcNow)
            );

            return SocketResponse.Reset(req.RequestId);
        }
        catch (IncorrectTimerIdException)
        {
            return SocketResponse.Error(
                new(
                    ErrorType.IncorrectTimerId,
                    "Currently running timer does not match the provided ID"
                ),
                req.RequestId
            );
        }
    }
}
