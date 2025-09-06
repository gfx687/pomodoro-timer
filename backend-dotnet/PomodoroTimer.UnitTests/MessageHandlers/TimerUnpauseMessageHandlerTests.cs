using Hangfire;
using Hangfire.Common;
using Hangfire.States;
using NSubstitute;
using PomodoroTimer.MessageHandlers;

namespace PomodoroTimer.UnitTests.MessageHandlers;

public class TimerUnpauseMessageHandlerTests
{
    [Fact]
    public async Task HandleAsync_StatusDoesNotExist_ShouldReturnNotFoundAsync()
    {
        // Arrange
        var req = new TimerUnpauseRequest
        {
            RequestId = Guid.NewGuid(),
            Payload = new(Guid.NewGuid()),
        };

        var timerManager = Substitute.For<ITimerManager>();
        timerManager.Unpause(req.Payload.Id).Returns(x => null);

        var db = Substitute.For<ITimerLogRepository>();
        var clock = Substitute.For<ISystemClock>();

        var handler = new TimerUnpauseMessageHandler(
            timerManager,
            db,
            Substitute.For<IBackgroundJobClient>(),
            clock
        );

        // Act
        var res = await handler.HandleAsync(req, CancellationToken.None);

        // Assert
        Assert.Equal(req.RequestId, res.RequestId);
        Assert.Equal(SocketResponseType.TimerNotFound, res.Type);
    }

    [Fact]
    public async Task HandleAsync_UnpauseThrewIncorrectTimerId_ShouldReturnErrorAsync()
    {
        // Arrange
        var req = new TimerUnpauseRequest
        {
            RequestId = Guid.NewGuid(),
            Payload = new(Guid.NewGuid()),
        };

        var timerManager = Substitute.For<ITimerManager>();
        timerManager.When(x => x.Unpause(req.Payload.Id)).Throws<IncorrectTimerIdException>();

        var handler = new TimerUnpauseMessageHandler(
            timerManager,
            Substitute.For<ITimerLogRepository>(),
            Substitute.For<IBackgroundJobClient>(),
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

    [Fact]
    public async Task HandleAsync_StatusExists_ShouldSaveLog()
    {
        // Arrange
        var req = new TimerUnpauseRequest
        {
            RequestId = Guid.NewGuid(),
            Payload = new(Guid.NewGuid()),
        };
        var expectedStatus = MessageHandlersTestsHelpers.EmptyStatus(req.RequestId.Value);

        var timerManager = Substitute.For<ITimerManager>();
        timerManager.Unpause(req.Payload.Id).Returns(expectedStatus);

        var db = Substitute.For<ITimerLogRepository>();
        var scheduler = Substitute.For<IBackgroundJobClient>();

        var now = DateTimeOffset.UtcNow.AddMinutes(-1);
        var clock = Substitute.For<ISystemClock>();
        clock.UtcNow.Returns(now);

        var handler = new TimerUnpauseMessageHandler(timerManager, db, scheduler, clock);

        // Act
        var res = await handler.HandleAsync(req, CancellationToken.None);

        // Assert
        Assert.Equal(req.RequestId, res.RequestId);
        Assert.Equal(SocketResponseType.TimerStatus, res.Type);
        Assert.Equal(expectedStatus, res.Payload);

        await db.Received()
            .SaveLogAsync(
                Arg.Is<TimerLog>(x =>
                    x.Id == req.Payload.Id
                    && x.Action == TimerLogActions.Unpause
                    && x.Timestamp == now
                )
            );
        scheduler
            .Received()
            .Create(
                Arg.Is<Job>(x => x.Type == typeof(LogFinishCommandHandler)),
                Arg.Any<ScheduledState>()
            );
    }
}
