public class LogFinishCommandHandler(
    ITimerLogRepository _db,
    ISocketConnectionStore _sockets,
    ILogger<LogFinishCommandHandler> _logger
)
{
    /// <param name="finishesAt">Provided because the scheduler might run the job late, so we cannot rely on Now()</param>
    public async Task HandleAsync(Guid timerId, DateTimeOffset finishesAt)
    {
        await _db.SaveLogAsync(new TimerLog(timerId, TimerLogActions.Finish, finishesAt));
        await _sockets.SendToAllAsync(SocketResponse.Finished(timerId, null));
        _logger.LogInformation($"LogFinishCommandHandler: finish timer {timerId}");
    }
}
