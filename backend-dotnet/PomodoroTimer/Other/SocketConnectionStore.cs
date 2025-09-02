using System.Collections.Concurrent;
using System.Net.WebSockets;

public interface ISocketConnectionStore
{
    Task CloseAllConnections();
    Task SendToAllAsync(SocketResponse message);
    void Remove(Guid id);
    void Save(Guid id, WebSocket socket);
}

public class SocketConnectionStore(ILogger<SocketConnectionStore> _logger) : ISocketConnectionStore
{
    ConcurrentDictionary<Guid, WebSocket> _subs = new();

    public void Save(Guid id, WebSocket socket)
    {
        _subs[id] = socket;
        _logger.LogInformation(
            "connection established. Total connections: {_subs.Count}",
            _subs.Count
        );
    }

    public void Remove(Guid id)
    {
        _subs.TryRemove(id, out _);
        _logger.LogInformation("connection dropped. Total connections: {_subs.Count}", _subs.Count);
    }

    public Task SendToAllAsync(SocketResponse message)
    {
        var sendTasks = _subs.Values.Select(x => x.SendAsync(message));
        return Task.WhenAll(sendTasks);
    }

    // TODO: verify graceful close message, not just abrupt closing
    public async Task CloseAllConnections()
    {
        var connections = _subs.ToList();

        foreach (var (id, socket) in connections)
        {
            try
            {
                if (socket.State == WebSocketState.Open)
                {
                    await socket.CloseAsync(
                        WebSocketCloseStatus.EndpointUnavailable,
                        "Server shutting down",
                        CancellationToken.None
                    );
                }
                Remove(id);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error closing WebSocket connection {ConnectionId}", id);
            }
        }
    }
}
