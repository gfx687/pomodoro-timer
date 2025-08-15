using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Serilog.Formatting.Json;

var builder = WebApplication.CreateBuilder(args);

var loggerConfig = new LoggerConfiguration();

if (builder.Environment.IsDevelopment())
    loggerConfig.MinimumLevel.Debug().WriteTo.Console();
else
    loggerConfig.MinimumLevel.Information().WriteTo.Console(new JsonFormatter());

Log.Logger = loggerConfig.CreateLogger();

try
{
    builder.Services.AddOpenApi();
    builder.Services.AddHostedService<BackgroundWorker>();
    builder.Services.AddSerilog();

    builder.Services.AddSingleton<TimerManager>();
    builder.Services.AddSingleton<SocketConnectionStore>();
    builder.Services.AddSingleton<MessageProcessor>();

    var app = builder.Build();

    app.UseWebSockets();

    app.Map(
        "/ws",
        async (
            HttpContext context,
            [FromServices] MessageProcessor logic,
            [FromServices] SocketConnectionStore connections,
            [FromServices] ILogger<Program> logger
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
                    logger.LogError(ex, "A connection-breaking error has occurred.");
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

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
    }

    app.UseHttpsRedirection();
    app.MapGet(
        "/state",
        ([FromServices] TimerManager manager) =>
        {
            return manager.Get();
        }
    );

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
