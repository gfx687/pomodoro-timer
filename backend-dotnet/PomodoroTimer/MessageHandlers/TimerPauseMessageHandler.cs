using Hangfire;

namespace PomodoroTimer.MessageHandlers;

public class TimerPauseMessageHandler(
    ITimerManager _manager,
    ITimerLogRepository _db,
    IBackgroundJobClient _scheduler,
    ISystemClock _clock
)
{
    public async Task<SocketResponse> HandleAsync(TimerPauseRequest req, CancellationToken ct)
    {
        try
        {
            var status = _manager.Pause(req.Payload.Id);

            if (status == null)
                return SocketResponse.NotFound(req.RequestId);

            var schedulerJobId = _manager.GetSchedulerJobId();
            _scheduler.Delete(schedulerJobId);

            await _db.SaveLogAsync(
                new TimerLog(req.Payload.Id, TimerLogActions.Pause, _clock.UtcNow)
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
