namespace PomodoroTimer.MessageHandlers;

public class TimerGetMessageHandler(ITimerManager _manager)
{
    public Task<SocketResponse> HandleAsync(TimerGetRequest req, CancellationToken ct)
    {
        var status = _manager.Get();
        return Task.FromResult(
            status == null
                ? SocketResponse.NotFound(req.RequestId)
                : SocketResponse.TimerStatus(status, req.RequestId)
        );
    }
}
