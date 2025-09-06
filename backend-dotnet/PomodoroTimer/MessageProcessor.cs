using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using PomodoroTimer.MessageHandlers;

public class MessageProcessor(
    ITimerManager _manager,
    IServiceProvider _services,
    ILogger<MessageProcessor> _logger
)
{
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() },
    };

    /// <returns>Response and whether or not message should be Broadcast</returns>
    public async Task<(SocketResponse Response, bool Broadcast)> ProcessMessage(
        byte[] buffer,
        WebSocketReceiveResult receiveResult,
        CancellationToken ct
    )
    {
        var json = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);

        SocketRequest? req = null;
        try
        {
            req = JsonSerializer.Deserialize<SocketRequest>(json, JsonOptions)!;
            var resp = await ProcessRequest(req, ct);
            var broadcast = req.Type != SocketRequestType.TimerGet;
            return (resp, broadcast);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Unable to deserialize the message");
            return (
                SocketResponse.Error(
                    new(ErrorType.WrongRequestFormat, "unable to deserialize the message")
                ),
                false
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "something went wrong while processing the message");
            return (
                SocketResponse.Error(
                    new(
                        ErrorType.UnknownRequestType,
                        "something went wrong while processing the message"
                    ),
                    req?.RequestId
                ),
                false
            );
        }
    }

    public SocketResponse GetTimerStatus()
    {
        var status = _manager.Get();
        return status == null ? SocketResponse.NotFound() : SocketResponse.TimerStatus(status);
    }

    async Task<SocketResponse> ProcessRequest(SocketRequest req, CancellationToken ct)
    {
        await using var scope = _services.CreateAsyncScope();

        SocketResponse resp;

        resp = req switch
        {
            PingRequest ping => SocketResponse.Pong(ping?.RequestId),
            TimerGetRequest get => await scope
                .ServiceProvider.GetRequiredService<TimerGetMessageHandler>()
                .HandleAsync(get, ct),
            TimerStartRequest start => await scope
                .ServiceProvider.GetRequiredService<TimerStartMessageHandler>()
                .HandleAsync(start, ct),
            TimerPauseRequest pause => await scope
                .ServiceProvider.GetRequiredService<TimerPauseMessageHandler>()
                .HandleAsync(pause, ct),
            TimerUnpauseRequest unpause => await scope
                .ServiceProvider.GetRequiredService<TimerUnpauseMessageHandler>()
                .HandleAsync(unpause, ct),
            TimerResetRequest reset => await scope
                .ServiceProvider.GetRequiredService<TimerResetMessageHandler>()
                .HandleAsync(reset, ct),
            _ => SocketResponse.Error(
                new(ErrorType.UnknownRequestType, "unknown request type"),
                req.RequestId
            ),
        };

        if (req.Type != SocketRequestType.Ping && req.Type != SocketRequestType.TimerGet)
        {
            // BUG: type field is logged 3 times (or maybe it is sent 3 times from frontend?)
            _logger.LogInformation($"Received request: {JsonSerializer.Serialize(req)}");
            _logger.LogInformation($"Sending response: {JsonSerializer.Serialize(resp)}");
        }

        return resp;
    }
}
