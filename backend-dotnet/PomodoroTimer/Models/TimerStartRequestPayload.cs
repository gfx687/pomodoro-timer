using System.Text.Json.Serialization;
using FluentValidation;

public class TimerStartRequestPayload
{
    /// <summary>
    /// Optional. Default = new UUID
    /// </summary>
    public Guid? Id { get; set; }

    [JsonRequired]
    public int DurationTotal { get; set; }

    [JsonRequired]
    public TimerModes Mode { get; set; }

    /// <summary>
    /// How much the of the Timer's duration is left.
    /// Provided for situations where client started a Timer without backend connection
    /// </summary>
    [JsonRequired]
    public int Remaining { get; set; }

    [JsonRequired]
    public DateTimeOffset StartedAt { get; set; }

    [JsonRequired]
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
