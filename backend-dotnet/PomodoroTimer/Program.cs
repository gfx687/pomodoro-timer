using FluentValidation;
using Hangfire;
using Hangfire.Storage.SQLite;
using Microsoft.EntityFrameworkCore;
using PomodoroTimer.MessageHandlers;
using Serilog;
using Serilog.Formatting.Json;

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.ConfigureLogger();

    builder.Services.AddOpenApi();
    // builder.Services.AddHostedService<BackgroundWorker>();
    builder.Services.AddSerilog();
    builder.Services.AddControllers();

    var connectionString =
        Environment.GetEnvironmentVariable("CONNECTION_STRING")
        ?? throw new InvalidOperationException(
            "Environment variable 'CONNECTION_STRING' is required."
        );

    builder.Services.AddDbContext<TimerDbContext>(options => options.UseSqlite(connectionString));

    builder.ConfigureHangfire();
    builder.ConfigureServices();

    var app = builder.Build();

    await using (var scope = app.Services.CreateAsyncScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<TimerDbContext>();
        await db.Database.MigrateAsync();
        await db.Database.EnsureCreatedAsync();
    }

    app.UseWebSockets();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.UseHangfireDashboard();
    }

    app.UseHttpsRedirection();
    app.MapControllers();

    app.Lifetime.ApplicationStopping.Register(async () =>
    {
        var connectionStore = app.Services.GetService<ISocketConnectionStore>();
        if (connectionStore != null)
        {
            await connectionStore.CloseAllConnections();
        }
    });

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

public static class ServerConfiguration
{
    public static void ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<ITimerManager, TimerManager>();
        builder.Services.AddSingleton<ISocketConnectionStore, SocketConnectionStore>();
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
        builder.Services.AddScoped<LogFinishCommandHandler>();
    }

    public static void ConfigureHangfire(this WebApplicationBuilder builder)
    {
        var hangfireConnectionString =
            Environment.GetEnvironmentVariable("HANGFIRE_CONNECTION_STRING")
            ?? throw new InvalidOperationException(
                "Environment variable 'HANGFIRE_CONNECTION_STRING' is required."
            );

        builder.Services.AddHangfire(config =>
            config
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSQLiteStorage(
                    hangfireConnectionString,
                    new SQLiteStorageOptions()
                    {
                        // This controls how often a WORKER checks the QUEUE for jobs.
                        // It makes workers pick up ready-to-run jobs faster.
                        QueuePollInterval = TimeSpan.FromSeconds(1),
                    }
                )
        );

        builder.Services.AddHangfireServer(x =>
        {
            // because sqlite
            x.WorkerCount = 1;
            // This controls how often the SCHEDULER checks for due jobs.
            // It makes scheduled jobs get moved to the queue faster.
            x.SchedulePollingInterval = TimeSpan.FromSeconds(1);
        });
    }

    public static void ConfigureLogger(this WebApplicationBuilder builder)
    {
        var loggerConfig = new LoggerConfiguration();

        if (builder.Environment.IsDevelopment())
        {
            loggerConfig
                // .MinimumLevel.Debug()
                .MinimumLevel.Information()
                .MinimumLevel.Override(
                    "Microsoft.EntityFrameworkCore",
                    Serilog.Events.LogEventLevel.Warning
                )
                .MinimumLevel.Override("Hangfire", Serilog.Events.LogEventLevel.Warning)
                .WriteTo.Console();
        }
        else
        {
            loggerConfig.MinimumLevel.Information().WriteTo.Console(new JsonFormatter());
        }

        Log.Logger = loggerConfig.CreateLogger();
    }
}
