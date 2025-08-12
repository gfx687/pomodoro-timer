using System.Collections.Concurrent;
using System.Net.WebSockets;

public class SocketConnectionStore
{
    ConcurrentDictionary<Guid, WebSocket> _subs = new();

    public Guid Save(Guid id, WebSocket socket)
    {
        _subs[id] = socket;
        System.Console.WriteLine($"connection established: {id}. Total connections: {_subs.Count}");
        return id;
    }

    public void Remove(Guid id)
    {
        _subs.TryRemove(id, out _);
        System.Console.WriteLine($"connection dropped: {id}. Total connections: {_subs.Count}");
    }

    public IEnumerable<WebSocket> GetAll() => _subs.Values;
}
