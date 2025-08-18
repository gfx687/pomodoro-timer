public interface ITimerLogRepository
{
    Task SaveLogAsync(TimerLog log);
}

public class TimerLogRepository(TimerDbContext _db) : ITimerLogRepository
{
    public async Task SaveLogAsync(TimerLog log)
    {
        await _db.TimerLogs.AddAsync(log);
        await _db.SaveChangesAsync();
    }
}
