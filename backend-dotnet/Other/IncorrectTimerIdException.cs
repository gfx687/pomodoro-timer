[System.Serializable]
public class IncorrectTimerIdException : System.Exception
{
    public IncorrectTimerIdException() { }

    public IncorrectTimerIdException(string message)
        : base(message) { }

    public IncorrectTimerIdException(string message, System.Exception inner)
        : base(message, inner) { }
}
