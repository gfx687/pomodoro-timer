using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

public class MessageProcessor(TimerManager _manager, ILogger<MessageProcessor> _logger)
{
    /// <returns>Response and whether or not message should be Broadcast</returns>
    public async Task<(SocketResponse Response, bool Broadcast)> ProcessMessage(
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

            var resp = await ProcessRequest(req);

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

    // TODO: would MediatR make this simpler?
    //          would likely make it easier to test too
    //          or do that without mediatr - just split this logic into handlers
    async Task<SocketResponse> ProcessRequest(SocketRequest req)
    {
        TimerStatus? status;
        try
        {
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

                    (status, var alreadyExists) = await _manager.Start(payload);

                    return alreadyExists
                        ? SocketResponse.TimerAlreadyExists(status, req.RequestId)
                        : SocketResponse.TimerStatus(status, req.RequestId);
                }
                case SocketRequestType.TimerPause:
                {
                    var (payload, error) = GetTimerIdPayload(req);
                    if (error != null)
                        return error;

                    status = await _manager.Pause(payload!.Id);
                    return status == null
                        ? SocketResponse.NotFound(req.RequestId)
                        : SocketResponse.TimerStatus(status, req.RequestId);
                }
                case SocketRequestType.TimerUnpause:
                {
                    var (payload, error) = GetTimerIdPayload(req);
                    if (error != null)
                        return error;

                    status = await _manager.Unpause(payload!.Id);
                    return status == null
                        ? SocketResponse.NotFound(req.RequestId)
                        : SocketResponse.TimerStatus(status, req.RequestId);
                }
                case SocketRequestType.TimerReset:
                {
                    var (payload, error) = GetTimerIdPayload(req);
                    if (error != null)
                        return error;

                    await _manager.Reset(payload!.Id);
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
        catch (IncorrectTimerIdException)
        {
            return SocketResponse.Error(
                new(
                    ErrorType.IncorrectTimerId,
                    "Currently running timer does not match the provided ID"
                ),
                req.RequestId
            );
        }
    }

    /// <summary>
    /// Returns either Payload or Error
    /// </summary>
    private (TimerIdPayload? Payload, SocketResponse? Error) GetTimerIdPayload(SocketRequest req)
    {
        if (req.Payload == null)
            return (
                null,
                SocketResponse.Error(
                    new(ErrorType.ValidationError, "payload is empty"),
                    req.RequestId
                )
            );

        try
        {
            return (req.Payload.Value.Deserialize<TimerIdPayload>()!, null);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Unable to deserialize the payload");
            return (
                null,
                SocketResponse.Error(
                    new(ErrorType.ValidationError, "unable to deserialize the payload"),
                    req.RequestId
                )
            );
        }
    }
}
