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
    [InlineData(0, 100)]
    [InlineData(-1, 100)]
    [InlineData(-50, 100)]
    [InlineData(150, 100)]
    public void Ctor_RemainingInvalid_ShouldThrowArgumentException(int remaining, int durationTotal)
    {
        // Act & Assert
        var exception = Assert.Throws<ArgumentException>(() =>
            new TimerState(
                Guid.NewGuid(),
                true,
                durationTotal,
                TimerModes.Work,
                DateTimeOffset.UtcNow,
                remaining,
                DateTimeOffset.UtcNow
            )
        );

        Assert.Contains("remainingOnPauseS must be > 0 and <= durationTotal", exception.Message);
    }

    #endregion

    #region GetRemaining

    [Theory]
    [InlineData(10)]
    [InlineData(50)]
    [InlineData(70)]
    public void GetRemaining_IsNotActive_ShouldReturnExpectedValue(int remaining)
    {
        // Arrange
        var state = new TimerState(
            Guid.NewGuid(),
            false,
            100,
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
    [InlineData(50, 10, 40)]
    [InlineData(50, 20, 30)]
    [InlineData(80, 70, 10)]
    public void GetRemaining_IsActive_ShouldReturnExpectedValue(
        int remaining,
        int secondsPassed,
        int expectedResult
    )
    {
        // Arrange
        var startedAt = DateTimeOffset.UtcNow;

        var state = new TimerState(
            Guid.NewGuid(),
            true,
            100,
            TimerModes.Work,
            startedAt,
            remaining,
            startedAt
        );

        // Act
        var result = state.GetRemaining(startedAt.AddSeconds(secondsPassed));

        // Assert
        Assert.Equal(expectedResult, result);
    }

    #endregion

    #region Pause

    [Fact]
    public void Pause_IsNotActive_ShouldNotChange()
    {
        // Arrange
        var startedAt = DateTimeOffset.UtcNow;
        var oldRemaining = 100;
        var state = new TimerState(
            Guid.NewGuid(),
            false,
            100,
            TimerModes.Work,
            startedAt,
            oldRemaining,
            startedAt
        );

        // Act
        state.Pause(startedAt.AddSeconds(50));

        // Assert
        Assert.False(state.IsActive);
        Assert.Equal(oldRemaining, state.RemainingOnPauseMs / 1000);
    }

    [Fact]
    public void Pause_IsActive_ShouldBecomeNotActiveAndUpdateRemaining()
    {
        // Arrange
        var secondsPassed = 30;
        var startedAt = DateTimeOffset.UtcNow;
        var oldRemaining = 100;
        var state = new TimerState(
            Guid.NewGuid(),
            true,
            100,
            TimerModes.Work,
            startedAt,
            oldRemaining,
            startedAt
        );

        // Act
        state.Pause(startedAt.AddSeconds(secondsPassed));

        // Assert
        var expectedRemaining = oldRemaining - secondsPassed;
        Assert.False(state.IsActive);
        Assert.Equal(expectedRemaining, state.RemainingOnPauseMs / 1000);
    }

    #endregion

    #region Unpause

    [Fact]
    public void Unpause_IsActive_ShouldNotChange()
    {
        // Arrange
        var remaining = 100;
        var startedAt = DateTimeOffset.UtcNow;
        var expectedExpiresAt = startedAt.AddSeconds(remaining);
        var state = new TimerState(
            Guid.NewGuid(),
            true,
            100,
            TimerModes.Work,
            startedAt,
            remaining,
            startedAt
        );

        // Act
        state.Unpause(startedAt.AddSeconds(10));

        // Assert
        Assert.True(state.IsActive);
        Assert.Equal(expectedExpiresAt, state.ExpiresAt);
    }

    [Fact]
    public void Unpause_IsNotActive_ShouldBecomeActiveWithNewLastUnpausedAt()
    {
        // Arrange
        var oldRemaining = 100;
        var secondsPassed = 10;
        var startedAt = DateTimeOffset.UtcNow;
        var state = new TimerState(
            Guid.NewGuid(),
            false,
            100,
            TimerModes.Work,
            startedAt,
            oldRemaining,
            startedAt
        );

        // Act
        state.Unpause(startedAt.AddSeconds(secondsPassed));

        // Assert
        var expectedExpiresAt = startedAt.AddSeconds(secondsPassed + oldRemaining);
        Assert.True(state.IsActive);
        Assert.Equal(expectedExpiresAt, state.ExpiresAt);
    }

    #endregion
}
