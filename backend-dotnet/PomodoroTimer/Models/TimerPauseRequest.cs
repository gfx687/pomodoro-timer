using System.Text.Json.Serialization;

public class TimerPauseRequest : SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override SocketRequestType Type => SocketRequestType.TimerPause;

    [JsonPropertyName("payload"), JsonRequired]
    public TimerIdPayload Payload { get; set; } = default!;
}
