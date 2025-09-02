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
    /// How much the of the Timer's duration is left.
    /// Provided for situations where client started a Timer without backend connection
    /// </summary>
    [JsonPropertyName("remaining"), JsonRequired]
    public int Remaining { get; set; }

    [JsonPropertyName("startedAt"), JsonRequired]
    public DateTimeOffset StartedAt { get; set; }

    [JsonPropertyName("isActive"), JsonRequired]
    public bool IsActive { get; set; }

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
