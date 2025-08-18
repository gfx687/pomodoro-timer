using System.Text.Json.Serialization;

public enum SocketResponseType
{
    /// <summary>
    /// Payload - <see cref="ErrorDetails"/>
    /// </summary>
    Error = 1,

    /// <summary>
    /// Payload - <see cref="TimerStatus"/>
    /// </summary>
    TimerStatus = 2,

    /// <summary>
    /// Payload - null
    /// </summary>
    TimerNotFound = 3,

    /// <summary>
    /// Payload - null
    /// </summary>
    TimerReset = 4,

    /// <summary>
    /// Payload - <see cref="TimerStatus"/>
    /// </summary>
    TimerAlreadyExists = 5,
}

public class SocketResponse
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    [JsonPropertyName("type")]
    public SocketResponseType Type { get; private set; }

    /// <summary>
    /// Optional RequestId for client to correlate request and response
    /// </summary>
    [JsonPropertyName("requestId")]
    public Guid? RequestId { get; private set; }

    [JsonPropertyName("payload")]
    public object? Payload { get; private set; }

    public static SocketResponse NotFound(Guid? requestId = null) =>
        new() { Type = SocketResponseType.TimerNotFound, RequestId = requestId };

    public static SocketResponse Reset(Guid? requestId = null) =>
        new() { Type = SocketResponseType.TimerReset, RequestId = requestId };

    public static SocketResponse TimerStatus(TimerStatus payload, Guid? requestId = null)
    {
        ArgumentNullException.ThrowIfNull(payload);
        return new()
        {
            Type = SocketResponseType.TimerStatus,
            Payload = payload,
            RequestId = requestId,
        };
    }

    public static SocketResponse TimerAlreadyExists(TimerStatus payload, Guid? requestId = null)
    {
        ArgumentNullException.ThrowIfNull(payload);
        return new()
        {
            Type = SocketResponseType.TimerAlreadyExists,
            Payload = payload,
            RequestId = requestId,
        };
    }

    public static SocketResponse Error(ErrorDetails e, Guid? requestId = null)
    {
        ArgumentNullException.ThrowIfNull(e);
        return new()
        {
            Type = SocketResponseType.Error,
            Payload = e,
            RequestId = requestId,
        };
    }
}
