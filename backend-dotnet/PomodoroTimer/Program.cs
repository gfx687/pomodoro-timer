using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PomodoroTimer.MessageHandlers;
using Serilog;
using Serilog.Formatting.Json;

var builder = WebApplication.CreateBuilder(args);

var loggerConfig = new LoggerConfiguration();

if (builder.Environment.IsDevelopment())
{
    loggerConfig
        // .MinimumLevel.Debug()
        .MinimumLevel.Information()
        .WriteTo.Console();
}
else
    loggerConfig.MinimumLevel.Information().WriteTo.Console(new JsonFormatter());

Log.Logger = loggerConfig.CreateLogger();

try
{
    builder.Services.AddOpenApi();
    builder.Services.AddHostedService<BackgroundWorker>();
    builder.Services.AddSerilog();

    var connectionString =
        Environment.GetEnvironmentVariable("CONNECTION_STRING")
        ?? throw new InvalidOperationException(
            "Environment variable 'CONNECTION_STRING' is required."
        );

    builder.Services.AddDbContext<TimerDbContext>(options => options.UseSqlite(connectionString));

    builder.Services.AddSingleton<ITimerManager, TimerManager>();
    builder.Services.AddSingleton<SocketConnectionStore>();
    builder.Services.AddSingleton<MessageProcessor>();
    builder.Services.AddSingleton<ISystemClock, SystemClock>();

    builder.Services.AddScoped<
        IValidator<TimerStartRequestPayload>,
        TimerStartRequestPayload.Validator
    >();

    builder.Services.AddScoped<ITimerLogRepository, TimerLogRepository>();
    builder.Services.AddScoped<TimerGetMessageHandler>();
    builder.Services.AddScoped<TimerStartMessageHandler>();
    builder.Services.AddScoped<TimerPauseMessageHandler>();
    builder.Services.AddScoped<TimerUnpauseMessageHandler>();
    builder.Services.AddScoped<TimerResetMessageHandler>();

    var app = builder.Build();

    await using (var scope = app.Services.CreateAsyncScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<TimerDbContext>();
        await db.Database.MigrateAsync();
        await db.Database.EnsureCreatedAsync();
    }

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
                        var (Response, Broadcast) = await logic.ProcessMessage(
                            buffer,
                            result,
                            CancellationToken.None // TODO: cancellation token propagation
                        );

                        if (Broadcast)
                            foreach (var s in connections.GetAll())
                                await s.SendAsync(Response);
                        else
                            await socket.SendAsync(Response);

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
