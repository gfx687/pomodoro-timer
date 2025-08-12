using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PomodoroModes
{
    Work = 1,
    Break = 2,
}
