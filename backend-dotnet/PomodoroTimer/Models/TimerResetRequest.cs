using System.Text.Json.Serialization;

public class TimerResetRequest : SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override SocketRequestType Type => SocketRequestType.TimerReset;

    [JsonPropertyName("payload"), JsonRequired]
    public TimerIdPayload Payload { get; set; } = default!;
}
