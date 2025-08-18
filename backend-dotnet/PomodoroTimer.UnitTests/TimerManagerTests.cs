using NSubstitute;

namespace PomodoroTimer.UnitTests;

public class TimerGetMEssageHandlerTests
{
    #region Get

    [Fact]
    public void Get_StateIsNull_ShouldReturnNull()
    {
        // Arrange
        var manager = new TimerManager(new SystemClock());

        // Act
        var res = manager.Get();

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Get_NoRemaining_ShouldReturnNull()
    {
        // Arrange
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        clock.UtcNow.Returns(DateTimeOffset.UtcNow.AddHours(-1));
        manager.Start(Guid.NewGuid(), new TimerStartRequestPayload { DurationTotal = 100 });
        clock.UtcNow.Returns(DateTimeOffset.UtcNow);

        // Act
        var res = manager.Get();

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Get_Default_ShouldReturnExpectedValue()
    {
        // Arrange
        var id = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        manager.Start(id, new TimerStartRequestPayload { DurationTotal = 100 });

        // Act
        var res = manager.Get();

        // Assert
        Assert.NotNull(res);
        Assert.Equal(id, res.Id);
    }

    #endregion

    #region Start

    [Fact]
    public void Start_AlreadyExists_ShouldReturnExpectedValue()
    {
        // Arrange
        var newId = Guid.NewGuid();
        var oldId = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // setting up state before the test
        manager.Start(oldId, new TimerStartRequestPayload { DurationTotal = 100 });

        // Act
        var (status, _) = manager.Start(newId, new TimerStartRequestPayload());

        // Assert
        Assert.Equal(oldId, status.Id);
    }

    [Fact]
    public void Start_StateIsNull_ShouldReturnNewState()
    {
        // Arrange
        var newId = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // Act
        var (status, _) = manager.Start(
            newId,
            new TimerStartRequestPayload { DurationTotal = 100 }
        );

        // Assert
        Assert.Equal(newId, status.Id);
    }

    [Fact]
    public void Start_NoRemaining_ShouldReturnNewStateAndLog()
    {
        // Arrange
        var oldId = Guid.NewGuid();
        var newId = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        clock.UtcNow.Returns(DateTimeOffset.UtcNow.AddHours(-1));
        manager.Start(oldId, new TimerStartRequestPayload { DurationTotal = 100 });
        clock.UtcNow.Returns(DateTimeOffset.UtcNow);

        // Act
        var (status, _) = manager.Start(
            newId,
            new TimerStartRequestPayload { DurationTotal = 100 }
        );

        // Assert
        Assert.Equal(newId, status.Id);
    }

    #endregion

    #region Unpause

    [Fact]
    public void Unpause_WrongTimerId_ShouldThrow()
    {
        // Arrange
        var oldId = Guid.NewGuid();
        var newId = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // setting up state before the test
        manager.Start(oldId, new TimerStartRequestPayload { DurationTotal = 100 });

        // Act & Assert

        Assert.Throws<IncorrectTimerIdException>(() => manager.Unpause(newId));
    }

    [Fact]
    public void Unpause_StateIsNull_ShouldReturnNull()
    {
        // Arrange
        var manager = new TimerManager(new SystemClock());

        // Act
        var res = manager.Unpause(Guid.NewGuid());

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Unpause_NoRemaining_ShouldReturnNull()
    {
        // Arrange
        var id = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        clock.UtcNow.Returns(DateTimeOffset.UtcNow.AddHours(-1));
        manager.Start(id, new TimerStartRequestPayload { DurationTotal = 100 });
        clock.UtcNow.Returns(DateTimeOffset.UtcNow);

        // Act
        var res = manager.Unpause(id);

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Unpause_Default_ShouldUnpause()
    {
        // Arrange
        var id = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // setting up state before the test
        manager.Start(id, new TimerStartRequestPayload { DurationTotal = 100 });
        manager.Pause(id);

        // Act
        var res = manager.Unpause(id);

        // Assert
        Assert.NotNull(res);
        Assert.True(res.IsActive);
    }

    #endregion

    #region Pause

    [Fact]
    public void Pause_WrongTimerId_ShouldThrow()
    {
        // Arrange
        var oldId = Guid.NewGuid();
        var newId = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // setting up state before the test
        manager.Start(oldId, new TimerStartRequestPayload { DurationTotal = 100 });

        // Act & Assert

        Assert.Throws<IncorrectTimerIdException>(() => manager.Pause(newId));
    }

    [Fact]
    public void Pause_StateIsNull_ShouldReturnNull()
    {
        // Arrange
        var manager = new TimerManager(new SystemClock());

        // Act
        var res = manager.Pause(Guid.NewGuid());

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Pause_NoRemaining_ShouldReturnNull()
    {
        // Arrange
        var id = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        clock.UtcNow.Returns(DateTimeOffset.UtcNow.AddHours(-1));
        manager.Start(id, new TimerStartRequestPayload { DurationTotal = 100 });
        clock.UtcNow.Returns(DateTimeOffset.UtcNow);

        // Act
        var res = manager.Pause(id);

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Pause_Default_ShouldPause()
    {
        // Arrange
        var id = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // setting up state before the test
        manager.Start(id, new TimerStartRequestPayload { DurationTotal = 100 });

        // Act
        var res = manager.Pause(id);

        // Assert
        Assert.NotNull(res);
        Assert.False(res.IsActive);
    }

    #endregion

    #region Reset

    [Fact]
    public void Reset_WrongTimerId_ShouldThrow()
    {
        // Arrange
        var oldId = Guid.NewGuid();
        var newId = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // setting up state before the test
        manager.Start(oldId, new TimerStartRequestPayload { DurationTotal = 100 });

        // Act & Assert
        Assert.Throws<IncorrectTimerIdException>(() => manager.Reset(newId));
    }

    [Fact]
    public void Reset_Default_ShouldReset()
    {
        // Arrange
        var id = Guid.NewGuid();
        var manager = new TimerManager(new SystemClock());

        // setting up state before the test
        manager.Start(id, new TimerStartRequestPayload { DurationTotal = 100 });

        // Act
        manager.Reset(id);
        var res = manager.Get();

        // Assert
        Assert.Null(res);
    }

    #endregion
}
