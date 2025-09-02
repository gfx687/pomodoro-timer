using System.Text.Json.Serialization;

public class PingRequest : SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public override SocketRequestType Type => SocketRequestType.Ping;
}
