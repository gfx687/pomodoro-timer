using System.Data.Common;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore.Diagnostics;

public sealed class SqlitePragmaInterceptor : DbConnectionInterceptor
{
    public override void ConnectionOpened(DbConnection connection, ConnectionEndEventData eventData)
    {
        ApplyPragmas(connection);
        base.ConnectionOpened(connection, eventData);
    }

    public override async Task ConnectionOpenedAsync(
        DbConnection connection,
        ConnectionEndEventData eventData,
        CancellationToken cancellationToken = default
    )
    {
        ApplyPragmas(connection);
        await base.ConnectionOpenedAsync(connection, eventData, cancellationToken);
    }

    private static void ApplyPragmas(DbConnection connection)
    {
        if (connection is not SqliteConnection sqlite)
            return;

        using var cmd = sqlite.CreateCommand();
        cmd.CommandText =
            @"PRAGMA synchronous=NORMAL;
            PRAGMA automatic_index=ON;
            PRAGMA foreign_keys=ON;";
        cmd.ExecuteNonQuery();
    }
}
