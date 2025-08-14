Practice project for implementing the same Pomodoro app using different tech stacks.

Frontend:
- [React](web-react/README.md)

Backend:
- [.NET](backend-dotnet/README.md)

## Versioning
Same number version of the frontend (i.e. `web-react-0.1.0`) should work with the matching versions of the backend (i.e. `backend-dotnet-0.1.0`).

### v0.1.0

WIP version:
- the core functions work but are unpolished
- no authorization or separation into clients, all connected clients see the same timer
- frontend can work without backend

**WebSocket API**:

For the API contracts check out [TypeScript types](https://github.com/gfx687/pomodoro-timer/blob/web-react-0.1.0/web-react/src/other/types.tsx), they are grouped into `OutgoingMessage` and `IncomingMessage`.


Request type | Response types
-|-
`TimerGetRequest`|`TimerStatusResponse` or `TimerNotFoundResponse`
`TimerStartRequest`|`TimerStatusResponse` or `TimerAlreadyExistsResponse`
`TimerPauseRequest`|`TimerStatusResponse` or `TimerNotFoundResponse`
`TimerUnpauseRequest`|`TimerStatusResponse` or `TimerNotFoundResponse`
`TimerResetRequest`|`TimerResetResponse`

Additionally:
- Responses to all Requests except for `TimerGetRequest` are broadcast to all connected sockets
- `TimerStatusResponse` is broadcast by backend every 10 seconds
