using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<PomodoroManager>();
builder.Services.AddSingleton<SocketConnectionStore>();
builder.Services.AddTransient<TempLogic>();

var app = builder.Build();

app.UseWebSockets();

app.Map(
    "/ws",
    async (
        HttpContext context,
        [FromServices] TempLogic logic,
        [FromServices] SocketConnectionStore connections
    ) =>
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            Guid connectionId = Guid.NewGuid();
            try
            {
                using var socket = await context.WebSockets.AcceptWebSocketAsync();

                var timerStatus = logic.GetTimerStatus();
                await socket.SendAsync(timerStatus);

                connectionId = connections.Save(connectionId, socket);

                var buffer = new byte[1024 * 4];
                var result = await socket.ReceiveAsync(
                    new ArraySegment<byte>(buffer),
                    CancellationToken.None
                );

                while (!result.CloseStatus.HasValue)
                {
                    var resp = logic.ProcessMessage(buffer, result);

                    if (resp.Broadcast)
                        foreach (var s in connections.GetAll())
                            await s.SendAsync(resp.Response);
                    else
                        await socket.SendAsync(resp.Response);

                    result = await socket.ReceiveAsync(
                        new ArraySegment<byte>(buffer),
                        CancellationToken.None
                    );
                }

                await socket.CloseAsync(
                    result.CloseStatus.Value,
                    result.CloseStatusDescription,
                    CancellationToken.None
                );
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex);
            }
            finally
            {
                connections.Remove(connectionId);
            }
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapGet(
    "/state",
    ([FromServices] PomodoroManager manager) =>
    {
        return manager.Get();
    }
);

app.Run();

public static class WebSocketExtensions
{
    public static async Task SendAsync(this WebSocket socket, SocketResponse message)
    {
        if (socket.State != WebSocketState.Open)
            return;

        var respJson = JsonSerializer.Serialize(message);
        var respBytes = Encoding.UTF8.GetBytes(respJson);

        await socket.SendAsync(
            new ArraySegment<byte>(respBytes),
            WebSocketMessageType.Text,
            endOfMessage: true,
            CancellationToken.None
        );
    }
}
