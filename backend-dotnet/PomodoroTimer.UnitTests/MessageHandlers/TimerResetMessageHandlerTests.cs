using NSubstitute;
using PomodoroTimer.MessageHandlers;

namespace PomodoroTimer.UnitTests.MessageHandlers;

public class TimerResetMessageHandlerTests
{
    [Fact]
    public async Task HandleAsync_Default_ShouldSaveResetAndReturn()
    {
        // Arrange
        var req = new TimerResetRequest
        {
            RequestId = Guid.NewGuid(),
            Payload = new() { Id = Guid.NewGuid() },
        };

        var timerManager = Substitute.For<ITimerManager>();

        var db = Substitute.For<ITimerLogRepository>();

        var now = DateTimeOffset.UtcNow.AddMinutes(-1);
        var clock = Substitute.For<ISystemClock>();
        clock.UtcNow.Returns(now);

        var handler = new TimerResetMessageHandler(timerManager, db, clock);

        // Act
        var res = await handler.HandleAsync(req, CancellationToken.None);

        // Assert
        Assert.Equal(req.RequestId, res.RequestId);
        Assert.Equal(SocketResponseType.TimerReset, res.Type);

        await db.Received()
            .SaveLogAsync(
                Arg.Is<TimerLog>(x =>
                    x.Id == req.Payload.Id
                    && x.Action == TimerLogActions.Reset
                    && x.Timestamp == now
                )
            );

        timerManager.Received().Reset(req.Payload.Id);
    }

    [Fact]
    public async Task HandleAsync_ResetThrewIncorrectTimerId_ShouldReturnErrorAsync()
    {
        // Arrange
        var req = new TimerResetRequest
        {
            RequestId = Guid.NewGuid(),
            Payload = new() { Id = Guid.NewGuid() },
        };

        var timerManager = Substitute.For<ITimerManager>();
        timerManager.When(x => x.Reset(req.Payload.Id)).Throws<IncorrectTimerIdException>();

        var handler = new TimerResetMessageHandler(
            timerManager,
            Substitute.For<ITimerLogRepository>(),
            Substitute.For<ISystemClock>()
        );

        // Act
        var res = await handler.HandleAsync(req, CancellationToken.None);

        // Assert
        Assert.Equal(req.RequestId, res.RequestId);
        Assert.Equal(SocketResponseType.Error, res.Type);
        Assert.IsType<ErrorDetails>(res.Payload);
        Assert.Equal(ErrorType.IncorrectTimerId, (res.Payload as ErrorDetails)!.ErrorType);
    }
}
