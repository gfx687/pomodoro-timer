using System.Collections.Concurrent;
using System.Net.WebSockets;

public class SocketConnectionStore(ILogger<SocketConnectionStore> _logger)
{
    ConcurrentDictionary<Guid, WebSocket> _subs = new();

    public Guid Save(Guid id, WebSocket socket)
    {
        _subs[id] = socket;
        _logger.LogInformation(
            "connection established. Total connections: {_subs.Count}",
            _subs.Count
        );
        return id;
    }

    public void Remove(Guid id)
    {
        _subs.TryRemove(id, out _);
        _logger.LogInformation("connection dropped. Total connections: {_subs.Count}", _subs.Count);
    }

    public IEnumerable<WebSocket> GetAll() => _subs.Values;
}
