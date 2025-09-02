using FluentValidation;
using Hangfire;

namespace PomodoroTimer.MessageHandlers;

public class TimerStartMessageHandler(
    ITimerManager _manager,
    ITimerLogRepository _db,
    IBackgroundJobClient _scheduler,
    IValidator<TimerStartRequestPayload> _validator
)
{
    public async Task<SocketResponse> HandleAsync(TimerStartRequest req, CancellationToken ct)
    {
        var validationResults = _validator.Validate(req.Payload);
        if (!validationResults.IsValid)
        {
            return SocketResponse.Error(
                new(
                    ErrorType.ValidationError,
                    string.Join("; ", validationResults.Errors.Select(x => x.ToString()))
                ),
                req.RequestId
            );
        }

        var timerId = req.Payload.Id ?? Guid.NewGuid();

        var (status, alreadyExists) = _manager.Start(timerId, req.Payload);

        if (alreadyExists)
            return SocketResponse.TimerAlreadyExists(status, req.RequestId);

        var schedulerJobId = _scheduler.Schedule<LogFinishCommandHandler>(
            x => x.HandleAsync(status.Id, status.ExpiresAt!.Value),
            TimeSpan.FromSeconds(status.RemainingS)
        );

        _manager.SetSchedulerJobId(schedulerJobId);

        await _db.SaveLogAsync(
            new TimerLog(
                timerId,
                TimerLogActions.Start,
                req.Payload.StartedAt,
                req.Payload.Mode,
                req.Payload.DurationTotal,
                req.Payload.Remaining
            )
        );
        return SocketResponse.TimerStatus(status, req.RequestId);
    }
}
