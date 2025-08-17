using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class TimerDbContext : DbContext
{
    private static SqlitePragmaInterceptor _interceptor = new();
    public DbSet<TimerLog> TimerLogs { get; set; }

    public TimerDbContext(DbContextOptions<TimerDbContext> options)
        : base(options) { }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_interceptor);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var dateTimeOffsetConverter = new ValueConverter<DateTimeOffset, long>(
            (x) => x.ToUnixTimeSeconds(),
            (x) => DateTimeOffset.FromUnixTimeSeconds(x)
        );

        modelBuilder.Entity<TimerLog>().HasKey((x) => x.PrimaryKey);
        modelBuilder.Entity<TimerLog>().Property((x) => x.PrimaryKey).ValueGeneratedOnAdd();

        modelBuilder.Entity<TimerLog>().Property((x) => x.Mode).HasConversion<string>();
        modelBuilder.Entity<TimerLog>().Property((x) => x.Action).HasConversion<string>();
        modelBuilder
            .Entity<TimerLog>()
            .Property((x) => x.Timestamp)
            .HasConversion(dateTimeOffsetConverter)
            .HasColumnType("INTEGER");

        base.OnModelCreating(modelBuilder);
    }
}
