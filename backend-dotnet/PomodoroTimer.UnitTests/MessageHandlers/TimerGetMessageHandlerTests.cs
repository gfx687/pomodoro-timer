using NSubstitute;
using PomodoroTimer.MessageHandlers;

namespace PomodoroTimer.UnitTests.MessageHandlers;

public class TimerGetMessageHandlerTests
{
    [Fact]
    public async Task Handle_StateExists_ShouldReturnExpectedResultAsync()
    {
        // Arrange
        var id = Guid.NewGuid();
        var status = new TimerStatus(id, true, 100, TimerModes.Work, DateTimeOffset.UtcNow);
        var manager = Substitute.For<ITimerManager>();
        manager.Get().Returns(status);
        var handler = new TimerGetMessageHandler(manager);

        // Act
        var res = await handler.HandleAsync(new() { RequestId = id }, CancellationToken.None);

        // Assert
        Assert.Equal(SocketResponseType.TimerStatus, res.Type);
        Assert.Equal(id, res.RequestId);
    }

    [Fact]
    public async Task Handle_StateDoesNotExists_ShouldReturnExpectedResultAsync()
    {
        // Arrange
        var id = Guid.NewGuid();
        var manager = Substitute.For<ITimerManager>();
        manager.Get().Returns(x => null);
        var handler = new TimerGetMessageHandler(manager);

        // Act
        var res = await handler.HandleAsync(new() { RequestId = id }, CancellationToken.None);

        // Assert
        Assert.Equal(SocketResponseType.TimerNotFound, res.Type);
        Assert.Equal(id, res.RequestId);
    }
}
