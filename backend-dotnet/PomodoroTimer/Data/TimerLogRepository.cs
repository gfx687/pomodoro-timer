using Microsoft.EntityFrameworkCore;

public interface ITimerLogRepository
{
    Task SaveLogAsync(TimerLog log);
    Task<IEnumerable<TimerLog>> GetDaysLogsAsync(DateTimeOffset from);
}

public class TimerLogRepository(TimerDbContext _db) : ITimerLogRepository
{
    public async Task SaveLogAsync(TimerLog log)
    {
        await _db.TimerLogs.AddAsync(log);
        await _db.SaveChangesAsync();
    }

    /// <summary>
    /// Get TimerLogs for a 24 hour period starting <paramref name="from"/>
    /// </summary>
    public async Task<IEnumerable<TimerLog>> GetDaysLogsAsync(DateTimeOffset from)
    {
        var to = from.AddHours(24);
        return await _db
            .TimerLogs.AsNoTracking()
            .Where(x => x.Timestamp >= from && x.Timestamp < to)
            .ToArrayAsync();
    }
}
