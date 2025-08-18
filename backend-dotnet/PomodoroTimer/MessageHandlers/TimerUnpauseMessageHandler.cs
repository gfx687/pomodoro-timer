namespace PomodoroTimer.MessageHandlers;

public class TimerUnpauseMessageHandler(
    ITimerManager _manager,
    ITimerLogRepository _db,
    ISystemClock _clock
)
{
    public async Task<SocketResponse> HandleAsync(TimerUnpauseRequest req, CancellationToken ct)
    {
        try
        {
            var status = _manager.Unpause(req.Payload.Id);
            if (status == null)
                return SocketResponse.NotFound(req.RequestId);

            await _db.SaveLogAsync(
                new TimerLog(req.Payload.Id, TimerLogActions.Unpause, _clock.UtcNow)
            );

            return SocketResponse.TimerStatus(status, req.RequestId);
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
