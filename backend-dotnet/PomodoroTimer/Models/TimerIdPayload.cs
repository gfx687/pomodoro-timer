using System.Text.Json.Serialization;

public class TimerIdPayload
{
    [JsonPropertyName("id"), JsonRequired]
    public Guid Id { get; set; }
}
