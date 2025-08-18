using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ErrorType
{
    UnknownRequestType = 1,
    ValidationError = 2,
    WrongRequestFormat = 3,

    /// <summary>
    /// Currently running timer does not match the provided ID
    /// </summary>
    IncorrectTimerId = 4,
}

public record ErrorDetails(ErrorType ErrorType, string Message);
