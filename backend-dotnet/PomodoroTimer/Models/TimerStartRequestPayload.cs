using System.Text.Json.Serialization;
using FluentValidation;

public class TimerStartRequestPayload
{
    /// <summary>
    /// Optional. Default = new UUID
    /// </summary>
    [JsonPropertyName("id")]
    public Guid? Id { get; set; }

    [JsonPropertyName("durationTotal"), JsonRequired]
    public int DurationTotal { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    [JsonPropertyName("mode"), JsonRequired]
    public TimerModes Mode { get; set; }

    /// <summary>
    /// If provided the timer will start at this remaining number of seconds
    /// Optional. Default = <see cref="DurationTotal"/>
    /// </summary>
    [JsonPropertyName("remaining")]
    public int? Remaining { get; set; }

    /// <summary>
    /// Optional. Default = current time
    /// </summary>
    [JsonPropertyName("startedAt")]
    public DateTimeOffset? StartedAt { get; set; }

    /// <summary>
    /// Whether or not the timer should start active.
    /// Optional. Default = True.
    /// Needed for the situation where frontend already had a timer running when connection established.
    /// </summary>
    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

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
