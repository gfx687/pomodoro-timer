using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;

public class WebsocketController(
    MessageProcessor logic,
    ISocketConnectionStore sockets,
    ILogger<WebsocketController> logger
) : ControllerBase
{
    [Route("ws")]
    public async Task Handle()
    {
        if (!HttpContext.WebSockets.IsWebSocketRequest)
        {
            HttpContext.Response.StatusCode = 400;
            return;
        }

        Guid connectionId = Guid.NewGuid();
        try
        {
            using var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();

            await socket.SendAsync(logic.GetTimerStatus());

            sockets.Save(connectionId, socket);

            var buffer = new byte[1024 * 4];
            var result = await socket.ReceiveAsync(
                new ArraySegment<byte>(buffer),
                CancellationToken.None
            );

            while (!result.CloseStatus.HasValue)
            {
                var (response, broadcast) = await logic.ProcessMessage(
                    buffer,
                    result,
                    CancellationToken.None // TODO: cancellation token propagation
                );

                if (broadcast)
                    await sockets.SendToAllAsync(response);
                else
                    await socket.SendAsync(response);

                result = await socket.ReceiveAsync(
                    new ArraySegment<byte>(buffer),
                    CancellationToken.None
                );
            }

            if (socket.State == WebSocketState.Open || socket.State == WebSocketState.CloseReceived)
            {
                await socket.CloseAsync(
                    result.CloseStatus.Value,
                    result.CloseStatusDescription,
                    CancellationToken.None
                );
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "A connection-breaking error has occurred.");
        }
        finally
        {
            sockets.Remove(connectionId);
        }
    }
}
