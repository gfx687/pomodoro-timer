using FluentValidation;
using FluentValidation.Results;
using NSubstitute;
using PomodoroTimer.MessageHandlers;

namespace PomodoroTimer.UnitTests.MessageHandlers;

public class TimerStartMessageHandlerTests
{
    [Fact]
    public async Task HandleAsync_ValidationFailed_ShouldReturnErrorAsync()
    {
        // Arrange
        var id = Guid.NewGuid();
        var validator = Substitute.For<IValidator<TimerStartRequestPayload>>();
        validator
            .Validate(Arg.Any<TimerStartRequestPayload>())
            .Returns(new ValidationResult([new ValidationFailure("", "")]));

        var handler = new TimerStartMessageHandler(
            Substitute.For<ITimerManager>(),
            Substitute.For<ITimerLogRepository>(),
            validator,
            Substitute.For<ISystemClock>()
        );

        // Act
        var res = await handler.HandleAsync(
            new TimerStartRequest { RequestId = id },
            CancellationToken.None
        );

        // Assert
        Assert.Equal(id, res.RequestId);
        Assert.Equal(SocketResponseType.Error, res.Type);
        Assert.IsType<ErrorDetails>(res.Payload);
        Assert.Equal(ErrorType.ValidationError, (res.Payload as ErrorDetails)!.ErrorType);
    }

    [Fact]
    public async Task HandleAsync_TimerAlreadyExists_ShouldReturnTimerAlreadyExists()
    {
        // Arrange
        var req = new TimerStartRequest
        {
            RequestId = Guid.NewGuid(),
            Payload = new() { Id = Guid.NewGuid() },
        };
        var expectedStatus = MessageHandlersTestsHelpers.EmptyStatus(req.RequestId.Value);

        var validator = Substitute.For<IValidator<TimerStartRequestPayload>>();
        validator.Validate(Arg.Any<TimerStartRequestPayload>()).Returns(new ValidationResult());

        var timerManager = Substitute.For<ITimerManager>();
        timerManager.Start(req.Payload.Id.Value, req.Payload).Returns((expectedStatus, true));

        var handler = new TimerStartMessageHandler(
            timerManager,
            Substitute.For<ITimerLogRepository>(),
            validator,
            Substitute.For<ISystemClock>()
        );

        // Act
        var res = await handler.HandleAsync(req, CancellationToken.None);

        // Assert
        Assert.Equal(req.RequestId, res.RequestId);
        Assert.Equal(SocketResponseType.TimerAlreadyExists, res.Type);
        Assert.IsType<TimerStatus>(res.Payload);
        Assert.Equal(expectedStatus, res.Payload);
    }

    [Theory]
    [InlineData("2000-05-05", "2000-01-01", "2000-05-05")]
    [InlineData(null, "2000-01-01", "2000-01-01")]
    public async Task HandleAsync_TimerDoesNotExist_ShouldReturnNewTimerAndLog(
        string? startedAt,
        string systemClockNow,
        string expectedTime
    )
    {
        // Arrange
        var req = new TimerStartRequest
        {
            RequestId = Guid.NewGuid(),
            Payload = new()
            {
                Id = Guid.NewGuid(),
                Mode = TimerModes.Break,
                StartedAt = startedAt == null ? null : DateTimeOffset.Parse(startedAt),
                DurationTotal = 1,
                Remaining = 1,
            },
        };
        var expectedStatus = MessageHandlersTestsHelpers.EmptyStatus(req.RequestId.Value);

        var validator = Substitute.For<IValidator<TimerStartRequestPayload>>();
        validator.Validate(Arg.Any<TimerStartRequestPayload>()).Returns(new ValidationResult());

        var timerManager = Substitute.For<ITimerManager>();
        timerManager.Start(req.Payload.Id.Value, req.Payload).Returns((expectedStatus, false));

        var db = Substitute.For<ITimerLogRepository>();

        var clockNow = DateTimeOffset.Parse(systemClockNow);
        var clock = Substitute.For<ISystemClock>();
        clock.UtcNow.Returns(clockNow);

        var handler = new TimerStartMessageHandler(timerManager, db, validator, clock);

        // Act
        var res = await handler.HandleAsync(req, CancellationToken.None);

        // Assert
        Assert.Equal(req.RequestId, res.RequestId);
        Assert.Equal(SocketResponseType.TimerStatus, res.Type);
        Assert.IsType<TimerStatus>(res.Payload);
        Assert.Equal(expectedStatus, res.Payload);

        await db.Received()
            .SaveLogAsync(
                Arg.Is<TimerLog>(x =>
                    x.Id == req.Payload.Id.Value
                    && x.Action == TimerLogActions.Start
                    && x.Timestamp == DateTimeOffset.Parse(expectedTime)
                    && x.Mode == req.Payload.Mode
                    && x.DurationTotal == req.Payload.DurationTotal
                    && x.RemainingAtCreationTime == req.Payload.Remaining
                )
            );
    }
}
