using System.Text.Json.Serialization;

public enum SocketRequestType
{
    TimerGet = 1,
    TimerStart = 2,
    TimerPause = 3,
    TimerReset = 4,
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
public abstract record SocketRequest
{
    public virtual SocketRequestType Type { get; set; }

    /// <summary>
    /// Optional RequestId for client to correlate request and response
    /// </summary>
    public Guid? RequestId { get; set; }
}

public record TimerGetRequest : SocketRequest
{
    public override SocketRequestType Type => SocketRequestType.TimerGet;
}

public record TimerStartRequest : SocketRequest
{
    public override SocketRequestType Type => SocketRequestType.TimerStart;

    [JsonRequired]
    public TimerStartRequestPayload Payload { get; set; } = default!;
}

public record TimerPauseRequest : SocketRequest
{
    public override SocketRequestType Type => SocketRequestType.TimerPause;

    [JsonRequired]
    public TimerIdPayload Payload { get; set; } = default!;
}

public record TimerUnpauseRequest : SocketRequest
{
    public override SocketRequestType Type => SocketRequestType.TimerUnpause;

    [JsonRequired]
    public TimerIdPayload Payload { get; set; } = default!;
}

public record TimerResetRequest : SocketRequest
{
    public override SocketRequestType Type => SocketRequestType.TimerReset;

    [JsonRequired]
    public TimerIdPayload Payload { get; set; } = default!;
}

public record PingRequest : SocketRequest
{
    public override SocketRequestType Type => SocketRequestType.Ping;
}
