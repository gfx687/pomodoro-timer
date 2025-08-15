public class BackgroundWorker(
    ILogger<BackgroundWorker> _logger,
    TimerManager _timers,
    SocketConnectionStore _connections
) : BackgroundService
{
    private int _executionCount = 0;

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            var count = Interlocked.Increment(ref _executionCount);

            var status = _timers.Get();
            var message =
                status == null ? SocketResponse.NotFound() : SocketResponse.TimerStatus(status);

            var sendTasks = _connections.GetAll().Select(x => x.SendAsync(message));
            await Task.WhenAll(sendTasks);

            _logger.LogDebug(
                $"{nameof(BackgroundWorker)}.{nameof(ExecuteAsync)} iterated. Count {count}"
            );

            await Task.Delay(10000, ct);
        }
    }
}
