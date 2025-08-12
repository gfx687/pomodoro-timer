using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

public class TempLogic(PomodoroManager _manager)
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
            var resp = ProcessRequest(req);
            var broadcast = req.Type != SocketRequestType.TimerGet;
            return (resp, broadcast);
        }
        catch (JsonException ex)
        {
            System.Console.WriteLine(ex);
            return (
                SocketResponse.Error(
                    new(ErrorType.WrongRequestFormat, "unable to deserialize the message")
                ),
                false
            );
        }
        catch (Exception ex)
        {
            System.Console.WriteLine(ex);
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
                    System.Console.WriteLine(ex);
                    return SocketResponse.Error(
                        new(ErrorType.ValidationError, "unable to deserialize the payload"),
                        req.RequestId
                    );
                }

                status = _manager.Start(payload.Duration, payload.Mode);
                return SocketResponse.TimerStatus(status, req.RequestId);
            }
            case SocketRequestType.TimerPause:
            {
                status = _manager.Pause();
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
