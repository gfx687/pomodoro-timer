public class BackgroundWorker(
    ILogger<BackgroundWorker> _logger,
    ITimerManager _timers,
    ISocketConnectionStore _sockets
) : BackgroundService
{
    private int _executionCount = 0;

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            try
            {
                var count = Interlocked.Increment(ref _executionCount);

                var status = _timers.Get();
                var message =
                    status == null ? SocketResponse.NotFound() : SocketResponse.TimerStatus(status);

                await _sockets.SendToAllAsync(message);

                _logger.LogDebug(
                    $"{nameof(BackgroundWorker)}.{nameof(ExecuteAsync)} iterated. Count {count}"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Something went wrong in the BackgroundWorker");
            }

            await Task.Delay(10000, ct);
        }
    }
}
