public class MessageHandlersTestsHelpers
{
    public static TimerStatus EmptyStatus(Guid reqId) =>
        new(reqId, true, 0, TimerModes.Work, DateTimeOffset.UtcNow);
}
