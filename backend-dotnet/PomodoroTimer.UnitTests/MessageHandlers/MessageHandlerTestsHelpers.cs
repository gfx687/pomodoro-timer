public class MessageHandlersTestsHelpers
{
    public static TimerStatus EmptyStatus(Guid reqId) =>
        new(reqId, true, 0, DateTimeOffset.UtcNow, TimerModes.Work, DateTimeOffset.UtcNow);
}
