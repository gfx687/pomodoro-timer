using System.Text.Json.Serialization;

public enum SocketRequestType
{
    /// <summary>
    /// Payload - null
    /// </summary>
    TimerGet = 1,

    /// <summary>
    /// Payload - <see cref="TimerStartRequestPayload"/>
    /// </summary>
    TimerStart = 2,

    /// <summary>
    /// Payload - <see cref="TimerIdPayload"/>
    /// </summary>
    TimerPause = 3,

    /// <summary>
    /// Payload - <see cref="TimerIdPayload"/>
    /// </summary>
    TimerReset = 4,

    /// <summary>
    /// Payload - <see cref="TimerIdPayload"/>
    /// </summary>
    TimerUnpause = 5,

    Ping = 6,
}

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(TimerGetRequest), nameof(SocketRequestType.TimerGet))]
[JsonDerivedType(typeof(TimerStartRequest), nameof(SocketRequestType.TimerStart))]
[JsonDerivedType(typeof(TimerPauseRequest), nameof(SocketRequestType.TimerPause))]
[JsonDerivedType(typeof(TimerUnpauseRequest), nameof(SocketRequestType.TimerUnpause))]
[JsonDerivedType(typeof(TimerResetRequest), nameof(SocketRequestType.TimerReset))]
[JsonDerivedType(typeof(PingRequest), nameof(SocketRequestType.Ping))]
public abstract class SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    [JsonPropertyName("type")]
    public virtual SocketRequestType Type { get; set; }

    /// <summary>
    /// Optional RequestId for client to correlate request and response
    /// </summary>
    [JsonPropertyName("requestId")]
    public Guid? RequestId { get; set; }
}
