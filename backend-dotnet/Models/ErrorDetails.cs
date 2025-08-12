using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ErrorType
{
    UnknownRequestType = 1,
    ValidationError = 2,
    WrongRequestFormat = 3,
}

public record ErrorDetails(ErrorType ErrorType, string Message);
