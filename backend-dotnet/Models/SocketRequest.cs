using System.Text.Json;
using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.Results;

public enum SocketRequestType
{
    /// <summary>
    /// Payload - null
    /// </summary>
    TimerGet = 1,

    /// <summary>
    /// Payload - <see cref="TimerStartRequestPayload"/>
    /// </summary>
    TimerStart = 2,

    /// <summary>
    /// Payload - null
    /// </summary>
    TimerPause = 3,

    /// <summary>
    /// Payload - null
    /// </summary>
    TimerReset = 4,
}

public class SocketRequest
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    [JsonPropertyName("type")]
    public SocketRequestType Type { get; set; }

    /// <summary>
    /// Optional RequestId for client to correlate request and response
    /// </summary>
    [JsonPropertyName("requestId")]
    public Guid? RequestId { get; set; }

    [JsonPropertyName("payload")]
    public JsonElement? Payload { get; set; }
}

public class TimerStartRequestPayload
{
    [JsonPropertyName("duration")]
    public int Duration { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    [JsonPropertyName("mode")]
    public PomodoroModes Mode { get; set; }

    public class Validator : AbstractValidator<TimerStartRequestPayload>
    {
        public static readonly Validator Instance = new();

        public Validator()
        {
            RuleFor(x => x.Mode).IsInEnum();
            RuleFor(x => x.Duration).GreaterThan(0);
        }
    }
}
