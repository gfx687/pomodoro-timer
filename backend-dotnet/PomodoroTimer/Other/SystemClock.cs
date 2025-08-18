public interface ISystemClock
{
    DateTimeOffset UtcNow { get; }
}

/// <summary>
/// Helps with testing
/// </summary>
public class SystemClock : ISystemClock
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
