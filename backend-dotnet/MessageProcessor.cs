using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

public class MessageProcessor(PomodoroManager _manager, ILogger<MessageProcessor> _logger)
{
    /// <returns>Response and whether or not message should be Broadcast</returns>
    public (SocketResponse Response, bool Broadcast) ProcessMessage(
        byte[] buffer,
        WebSocketReceiveResult receiveResult
    )
    {
        var json = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);

        SocketRequest? req = null;
        try
        {
            req = JsonSerializer.Deserialize<SocketRequest>(json)!;
            _logger.LogInformation($"Received request type: {req.Type}");

            _logger.LogDebug($"Received payload: {JsonSerializer.Serialize(req.Payload)}");

            var resp = ProcessRequest(req);

            _logger.LogDebug($"Sending payload: {JsonSerializer.Serialize(resp.Payload)}");

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

    SocketResponse ProcessRequest(SocketRequest req)
    {
        PomodoroStatus? status;
        switch (req.Type)
        {
            case SocketRequestType.TimerGet:
            {
                status = _manager.Get();
                return status == null
                    ? SocketResponse.NotFound(req.RequestId)
                    : SocketResponse.TimerStatus(status, req.RequestId);
            }
            case SocketRequestType.TimerStart:
            {
                if (req.Payload == null)
                    return SocketResponse.Error(
                        new(ErrorType.ValidationError, "payload is empty"),
                        req.RequestId
                    );

                TimerStartRequestPayload? payload;
                try
                {
                    payload = req.Payload.Value.Deserialize<TimerStartRequestPayload>()!;
                    var results = TimerStartRequestPayload.Validator.Instance.Validate(payload);
                    if (!results.IsValid)
                    {
                        return SocketResponse.Error(
                            new(
                                ErrorType.ValidationError,
                                string.Join("; ", results.Errors.Select(x => x.ToString()))
                            ),
                            req.RequestId
                        );
                    }
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Unable to deserialize the payload");
                    return SocketResponse.Error(
                        new(ErrorType.ValidationError, "unable to deserialize the payload"),
                        req.RequestId
                    );
                }

                (status, var alreadyExists) = _manager.Start(payload);

                return alreadyExists
                    ? SocketResponse.TimerAlreadyExists(status, req.RequestId)
                    : SocketResponse.TimerStatus(status, req.RequestId);
            }
            case SocketRequestType.TimerPause:
            {
                status = _manager.Pause();
                return status == null
                    ? SocketResponse.NotFound(req.RequestId)
                    : SocketResponse.TimerStatus(status, req.RequestId);
            }
            case SocketRequestType.TimerUnpause:
            {
                status = _manager.Unpause();
                return status == null
                    ? SocketResponse.NotFound(req.RequestId)
                    : SocketResponse.TimerStatus(status, req.RequestId);
            }
            case SocketRequestType.TimerReset:
            {
                _manager.Reset();
                return SocketResponse.Reset(req.RequestId);
            }
            default:
            {
                return SocketResponse.Error(
                    new(ErrorType.UnknownRequestType, $"unknown Request.Type: {req.Type}"),
                    req.RequestId
                );
            }
        }
    }
}
