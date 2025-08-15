using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TimerModes
{
    Work = 1,
    Break = 2,
}
