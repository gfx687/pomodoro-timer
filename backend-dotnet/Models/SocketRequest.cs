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

    /// <summary>
    /// Payload - null
    /// </summary>
    TimerUnpause = 5,
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
    [JsonPropertyName("durationTotal")]
    public int DurationTotal { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    [JsonPropertyName("mode")]
    public TimerModes Mode { get; set; }

    /// <summary>
    /// If provided the timer will start at this remaining number of seconds
    /// </summary>
    [JsonPropertyName("remaining")]
    public int? Remaining { get; set; }

    [JsonPropertyName("startedAt")]
    public DateTimeOffset? StartedAt { get; set; }

    public class Validator : AbstractValidator<TimerStartRequestPayload>
    {
        public static readonly Validator Instance = new();

        public Validator()
        {
            RuleFor(x => x.Mode).IsInEnum();
            RuleFor(x => x.DurationTotal).GreaterThan(0);
            RuleFor(x => x.Remaining).GreaterThan(0).LessThanOrEqualTo(x => x.DurationTotal);
        }
    }
}
