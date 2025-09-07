using System.Text.Json;
using System.Text.Json.Serialization;

internal record TestData(
    DateTimeOffset InputFrom,
    List<TimerLog> InputLogs,
    List<ChartHeader> OutputHeaders,
    List<string> OutputDataRow
);

public class PrepareChartDataTests
{
    internal static TestData GetTestData(string testFilePath)
    {
        var json = File.ReadAllText(testFilePath);
        var data = JsonSerializer.Deserialize<TestData>(
            json,
            new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                Converters = { new JsonStringEnumConverter() },
            }
        );
        return data!;
    }

    [Theory]
    [InlineData($"Controllers/prepare-chart-data-regression-test-1.json")]
    [InlineData($"Controllers/prepare-chart-data-regression-test-2.json")]
    [InlineData($"Controllers/prepare-chart-data-regression-test-3.json")]
    [InlineData($"Controllers/prepare-chart-data-regression-test-4.json")]
    [InlineData($"Controllers/prepare-chart-data-regression-test-5.json")]
    [InlineData($"Controllers/prepare-chart-data-regression-test-6.json")]
    [InlineData($"Controllers/prepare-chart-data-regression-test-7.json")]
    [InlineData($"Controllers/prepare-chart-data-regression-test-8.json")]
    public void PrepareChartData_RegressionTests(string testFilePath)
    {
        // Arrange
        var testData = GetTestData(testFilePath);

        // Act
        var res = TimersController.PrepareChartData(testData.InputLogs, testData.InputFrom);

        Assert.Equal(testData.OutputHeaders, res.Item1);
        Assert.Equal(testData.OutputDataRow, res.Item2);
    }
}
