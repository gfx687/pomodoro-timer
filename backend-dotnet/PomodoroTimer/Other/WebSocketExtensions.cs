using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

public static class WebSocketExtensions
{
    public static async Task SendAsync(this WebSocket socket, SocketResponse message)
    {
        if (socket.State != WebSocketState.Open)
            return;

        var respJson = JsonSerializer.Serialize(message, MessageProcessor.JsonOptions);
        var respBytes = Encoding.UTF8.GetBytes(respJson);

        await socket.SendAsync(
            new ArraySegment<byte>(respBytes),
            WebSocketMessageType.Text,
            endOfMessage: true,
            CancellationToken.None
        );
    }
}
