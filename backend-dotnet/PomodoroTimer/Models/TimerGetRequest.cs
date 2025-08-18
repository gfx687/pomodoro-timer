using System.Text.Json.Serialization;

public class TimerGetRequest : SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override SocketRequestType Type => SocketRequestType.TimerGet;
}
