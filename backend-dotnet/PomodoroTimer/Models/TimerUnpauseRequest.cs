using System.Text.Json.Serialization;

public class TimerUnpauseRequest : SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override SocketRequestType Type => SocketRequestType.TimerUnpause;

    [JsonPropertyName("payload"), JsonRequired]
    public TimerIdPayload Payload { get; set; } = default!;
}
