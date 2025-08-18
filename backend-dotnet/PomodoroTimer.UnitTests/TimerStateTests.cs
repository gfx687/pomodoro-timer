namespace PomodoroTimer.UnitTests;

public class TimerStateTests
{
    #region Ctor

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public void Ctor_DurationTotalInvalid_ShouldThrowArgumentException(int durationTotal)
    {
        // Act & Assert
        var exception = Assert.Throws<ArgumentException>(() =>
            new TimerState(
                Guid.NewGuid(),
                true,
                durationTotal,
                TimerModes.Work,
                DateTimeOffset.UtcNow,
                50,
                DateTimeOffset.UtcNow
            )
        );

        Assert.Contains("durationTotal must be more than 0", exception.Message);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-50)]
    public void Ctor_RemainingInvalid_ShouldThrowArgumentException(int remaining)
    {
        // Act & Assert
        var exception = Assert.Throws<ArgumentException>(() =>
            new TimerState(
                Guid.NewGuid(),
                true,
                100,
                TimerModes.Work,
                DateTimeOffset.UtcNow,
                remaining,
                DateTimeOffset.UtcNow
            )
        );

        Assert.Contains("remaining must be more than 0", exception.Message);
    }

    [Theory]
    [InlineData(50, 50, 0)]
    [InlineData(100, 50, 50)]
    [InlineData(150, 30, 120)]
    public void Ctor_RemainingProvided_ShouldSetCorrectElapsedBeforePause(
        int durationTotal,
        int remaining,
        int expectedResult
    )
    {
        // Act
        var state = new TimerState(
            Guid.NewGuid(),
            true,
            durationTotal,
            TimerModes.Work,
            DateTimeOffset.UtcNow,
            remaining,
            DateTimeOffset.UtcNow
        );

        // Assert
        Assert.True(state.IsActive);
        Assert.Equal(durationTotal, state.DurationTotal);
        Assert.Equal(expectedResult, state.ElapsedBeforePause);
    }

    #endregion

    #region GetRemaining

    [Theory]
    [InlineData(50, 50)]
    [InlineData(100, 50)]
    [InlineData(150, 120)]
    public void GetRemaining_IsNotActive_ShouldReturnExpectedValue(int durationTotal, int remaining)
    {
        // Arrange
        var state = new TimerState(
            Guid.NewGuid(),
            false,
            durationTotal,
            TimerModes.Work,
            DateTimeOffset.UtcNow,
            remaining,
            DateTimeOffset.UtcNow
        );

        // Act
        var result = state.GetRemaining(DateTimeOffset.UtcNow);

        // Assert
        Assert.Equal(remaining, result);
    }

    [Theory]
    [InlineData(50, 50, 10, 40)]
    [InlineData(100, 50, 20, 30)]
    [InlineData(150, 120, 50, 70)]
    public void GetRemaining_IsActive_ShouldReturnExpectedValue(
        int durationTotal,
        int remaining,
        int secondsPassed,
        int expectedResult
    )
    {
        // Arrange
        var lastUnpausedAt = DateTimeOffset.UtcNow;

        var state = new TimerState(
            Guid.NewGuid(),
            true,
            durationTotal,
            TimerModes.Work,
            DateTimeOffset.UtcNow,
            remaining,
            lastUnpausedAt
        );

        // Act
        var result = state.GetRemaining(lastUnpausedAt.AddSeconds(secondsPassed));

        // Assert
        Assert.Equal(expectedResult, result);
    }

    #endregion

    #region Pause

    [Fact]
    public void Pause_IsNotActive_ShouldNotChange()
    {
        // Arrange
        var state = new TimerState(
            Guid.NewGuid(),
            false,
            100,
            TimerModes.Work,
            DateTimeOffset.UtcNow,
            100,
            DateTimeOffset.UtcNow
        );

        var oldElapsed = state.ElapsedBeforePause;

        // Act
        state.Pause(DateTimeOffset.UtcNow);

        // Assert
        Assert.False(state.IsActive);
        Assert.Equal(oldElapsed, state.ElapsedBeforePause);
    }

    [Fact]
    public void Pause_IsActive_ShouldBecomeNotActiveAndUpdateElapsedBeforePause()
    {
        // Arrange
        var lastUnpausedAt = DateTimeOffset.UtcNow;
        var secondsPassed = 10;
        var state = new TimerState(
            Guid.NewGuid(),
            true,
            100,
            TimerModes.Work,
            DateTimeOffset.UtcNow,
            100,
            lastUnpausedAt
        );

        // Act
        state.Pause(lastUnpausedAt.AddSeconds(secondsPassed));

        // Assert
        Assert.False(state.IsActive);
        Assert.Equal(secondsPassed, state.ElapsedBeforePause);
    }

    #endregion

    #region Unpause

    [Fact]
    public void Unpause_IsActive_ShouldNotChange()
    {
        // Arrange
        var lastUnpausedAt = DateTimeOffset.UtcNow;
        var state = new TimerState(
            Guid.NewGuid(),
            true,
            100,
            TimerModes.Work,
            DateTimeOffset.UtcNow,
            100,
            lastUnpausedAt
        );

        // Act
        state.Unpause(lastUnpausedAt.AddSeconds(10));

        // Assert
        Assert.True(state.IsActive);
        Assert.Equal(lastUnpausedAt, state.LastUnpausedAt);
    }

    [Fact]
    public void Unpause_IsNotActive_ShouldBecomeActiveWithNewLastUnpausedAt()
    {
        // Arrange
        var lastUnpausedAt = DateTimeOffset.UtcNow;
        var newUnpausedAt = lastUnpausedAt.AddSeconds(30);

        var state = new TimerState(
            Guid.NewGuid(),
            false,
            100,
            TimerModes.Work,
            DateTimeOffset.UtcNow,
            100,
            lastUnpausedAt
        );

        // Act
        state.Unpause(newUnpausedAt);

        // Assert
        Assert.True(state.IsActive);
        Assert.Equal(newUnpausedAt, state.LastUnpausedAt);
    }

    #endregion
}
