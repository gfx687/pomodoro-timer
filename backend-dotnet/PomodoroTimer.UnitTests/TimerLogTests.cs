namespace PomodoroTimer.UnitTests;

public class TimerLogTests
{
    [Fact]
    public void Ctor_StartActionWithoutMode_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        var exception = Assert.Throws<ArgumentNullException>(() =>
            new TimerLog(Guid.NewGuid(), TimerLogActions.Start, DateTimeOffset.UtcNow)
        );

        Assert.Equal("mode", exception.ParamName);
    }

    [Fact]
    public void Ctor_StartActionWithoutDurationTotal_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        var exception = Assert.Throws<ArgumentNullException>(() =>
            new TimerLog(
                Guid.NewGuid(),
                TimerLogActions.Start,
                DateTimeOffset.UtcNow,
                TimerModes.Work
            )
        );

        Assert.Equal("durationTotal", exception.ParamName);
    }

    [Fact]
    public void Ctor_StartActionWithRemainingAtCreationTime_ShouldUseProvidedValue()
    {
        // Arrange
        var durationTotal = 1500;
        var remainingAtCreationTime = 1200;

        // Act
        var log = new TimerLog(
            Guid.NewGuid(),
            TimerLogActions.Start,
            DateTimeOffset.UtcNow,
            TimerModes.Work,
            durationTotal,
            remainingAtCreationTime
        );

        // Assert
        Assert.Equal(remainingAtCreationTime, log.RemainingAtCreationTime);
        Assert.Equal(durationTotal, log.DurationTotal);
    }

    [Theory]
    [InlineData(TimerLogActions.Pause)]
    [InlineData(TimerLogActions.Unpause)]
    [InlineData(TimerLogActions.Finish)]
    [InlineData(TimerLogActions.Reset)]
    public void Ctor_NonStartAction_ShouldNotRequireModeOrDuration(TimerLogActions action)
    {
        // Arrange
        var id = Guid.NewGuid();
        var timestamp = DateTimeOffset.UtcNow;

        // Act
        var log = new TimerLog(id, action, timestamp);

        // Assert
        Assert.Equal(id, log.Id);
        Assert.Equal(action, log.Action);
        Assert.Equal(timestamp, log.Timestamp);
        Assert.Null(log.Mode);
        Assert.Null(log.DurationTotal);
        Assert.Null(log.RemainingAtCreationTime);
    }
}
