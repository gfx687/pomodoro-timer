using System.Text.Json.Serialization;

public record TimerIdPayload([property: JsonRequired] Guid Id);
