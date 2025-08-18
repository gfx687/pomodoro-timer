using System.Text.Json.Serialization;
using FluentValidation;

public class TimerStartRequestPayload
{
    /// <summary>
    /// If not provided the server will generate it
    /// </summary>
    [JsonPropertyName("id")]
    public Guid? Id { get; set; }

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

    /// <summary>
    /// If not provided the server will use current time
    /// </summary>
    [JsonPropertyName("startedAt")]
    public DateTimeOffset? StartedAt { get; set; }

    public class Validator : AbstractValidator<TimerStartRequestPayload>
    {
        public Validator()
        {
            RuleFor(x => x.Mode).IsInEnum();
            RuleFor(x => x.DurationTotal).GreaterThan(0);
            RuleFor(x => x.Remaining).GreaterThan(0).LessThanOrEqualTo(x => x.DurationTotal);
        }
    }
}
