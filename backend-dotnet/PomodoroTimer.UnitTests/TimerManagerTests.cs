using NSubstitute;

namespace PomodoroTimer.UnitTests;

public class TimerManagerTests
{
    private static TimerStartRequestPayload GetStartRequest()
    {
        return new TimerStartRequestPayload
        {
            Id = Guid.NewGuid(),
            IsActive = true,
            DurationTotal = 100,
            Mode = TimerModes.Work,
            StartedAt = DateTimeOffset.UtcNow,
            Remaining = 100,
        };
    }

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
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);
        clock.UtcNow.Returns(startRequest.StartedAt.AddSeconds(1000));

        // Act
        var res = manager.Get();

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Get_Default_ShouldReturnExpectedValue()
    {
        // Arrange
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

        // Act
        var res = manager.Get();

        // Assert
        Assert.NotNull(res);
        Assert.Equal(startRequest.Id, res.Id);
    }

    #endregion

    #region Start

    [Fact]
    public void Start_AlreadyExists_ShouldReturnExpectedValue()
    {
        // Arrange
        var newId = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

        // Act
        var (status, _) = manager.Start(newId, new TimerStartRequestPayload());

        // Assert
        Assert.Equal(startRequest.Id!.Value, status.Id);
    }

    [Fact]
    public void Start_NoRemaining_ShouldReturnNewStateAndLog()
    {
        // Arrange
        var newId = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);
        clock.UtcNow.Returns(startRequest.StartedAt.AddSeconds(1000));

        // Act
        var (status, _) = manager.Start(newId, startRequest);

        // Assert
        Assert.Equal(newId, status.Id);
    }

    [Fact]
    public void Start_StateIsNull_ShouldReturnNewState()
    {
        // Arrange
        var manager = new TimerManager(new SystemClock());
        var startRequest = GetStartRequest();

        // Act
        var (status, _) = manager.Start(startRequest.Id!.Value, startRequest);

        // Assert
        Assert.Equal(startRequest.Id!.Value, status.Id);
    }

    #endregion

    #region Unpause

    [Fact]
    public void Unpause_WrongTimerId_ShouldThrow()
    {
        // Arrange
        var newId = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

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
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);
        clock.UtcNow.Returns(startRequest.StartedAt.AddSeconds(1000));

        // Act
        var res = manager.Unpause(startRequest.Id!.Value);

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Unpause_Default_ShouldUnpause()
    {
        // Arrange
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

        // Act
        var res = manager.Unpause(startRequest.Id!.Value);

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
        var newId = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

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
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);
        clock.UtcNow.Returns(startRequest.StartedAt.AddSeconds(1000));

        // Act
        var res = manager.Pause(startRequest.Id!.Value);

        // Assert
        Assert.Null(res);
    }

    [Fact]
    public void Pause_Default_ShouldPause()
    {
        // Arrange
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

        // Act
        var res = manager.Pause(startRequest.Id!.Value);

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
        var newId = Guid.NewGuid();
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

        // Act & Assert
        Assert.Throws<IncorrectTimerIdException>(() => manager.Reset(newId));
    }

    [Fact]
    public void Reset_Default_ShouldReset()
    {
        // Arrange
        var clock = Substitute.For<ISystemClock>();
        var manager = new TimerManager(clock);

        // setting up state before the test
        var startRequest = GetStartRequest();
        clock.UtcNow.Returns(startRequest.StartedAt);
        manager.Start(startRequest.Id!.Value, startRequest);

        // Act
        manager.Reset(startRequest.Id!.Value);
        var res = manager.Get();

        // Assert
        Assert.Null(res);
    }

    #endregion
}
