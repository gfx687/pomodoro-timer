using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PomodoroTimer.Migrations
{
    /// <inheritdoc />
    public partial class AddTable_TimerLogs_SetUpPragmas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("PRAGMA journal_mode=WAL;", suppressTransaction: true);
            migrationBuilder.Sql(
                "PRAGMA auto_vacuum=INCREMENTAL; VACUUM;",
                suppressTransaction: true
            );

            migrationBuilder.CreateTable(
                name: "TimerLogs",
                columns: table => new
                {
                    PrimaryKey = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Action = table.Column<string>(type: "TEXT", nullable: false),
                    Timestamp = table.Column<long>(type: "INTEGER", nullable: false),
                    Mode = table.Column<string>(type: "TEXT", nullable: true),
                    DurationTotal = table.Column<int>(type: "INTEGER", nullable: true),
                    RemainingAtCreationTime = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimerLogs", x => x.PrimaryKey);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TimerLogs");
        }
    }
}
