using System.Text.Json.Serialization;

public class TimerStartRequest : SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override SocketRequestType Type => SocketRequestType.TimerStart;

    [JsonPropertyName("payload"), JsonRequired]
    public TimerStartRequestPayload Payload { get; set; } = default!;
}
