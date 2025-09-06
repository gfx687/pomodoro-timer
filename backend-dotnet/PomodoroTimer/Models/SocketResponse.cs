public enum SocketResponseType
{
    Error = 1,
    TimerStatus = 2,
    TimerNotFound = 3,
    TimerReset = 4,
    TimerAlreadyExists = 5,
    TimerFinished = 6,
    Pong = 7,
}

public record SocketResponse(SocketResponseType Type, Guid? RequestId, object? Payload = null)
{
    public static SocketResponse Pong(Guid? requestId = null) =>
        new(SocketResponseType.Pong, requestId);

    public static SocketResponse NotFound(Guid? requestId = null) =>
        new(SocketResponseType.TimerNotFound, requestId);

    public static SocketResponse Reset(Guid? requestId = null) =>
        new(SocketResponseType.TimerReset, requestId);

    public static SocketResponse TimerStatus(TimerStatus payload, Guid? requestId = null)
    {
        ArgumentNullException.ThrowIfNull(payload);
        return new(SocketResponseType.TimerStatus, requestId, payload);
    }

    public static SocketResponse TimerAlreadyExists(TimerStatus payload, Guid? requestId = null)
    {
        ArgumentNullException.ThrowIfNull(payload);
        return new(SocketResponseType.TimerAlreadyExists, requestId, payload);
    }

    public static SocketResponse Finished(Guid id, Guid? requestId) =>
        new(SocketResponseType.TimerFinished, requestId, new TimerIdPayload(id));

    public static SocketResponse Error(ErrorDetails e, Guid? requestId = null)
    {
        ArgumentNullException.ThrowIfNull(e);
        return new(SocketResponseType.Error, requestId, e);
    }
}
