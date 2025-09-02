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

### v0.2.0

Breaking changes:
- the requests are the same and follow the same logic but now require `{ "payload": { "id": TIMER_ID } }`

Features:
- added Icon Tray with the WebSocket connection status and "muted" icon
- backend now persists the Timer actions log, though frontend does not show it (yet)

Bugfixes:
- pausing the timer within one seconds of the start no longer leaves it in a faulty state
- timer no longer auto-resumes when an offline client connects to the backend

### v0.3.0

Breaking changes:
- backend no longer broadcasts TimerStatus every 10 seconds

Features:
- added Charts page with information about past timers
- backend now sends out TimerFinished message

Bugfixes:
- client timer now continues ticking even with the TimerPage not open

## Api

API for the latest version available.

### WebSocket API

For the WebSocket API contracts check [TypeScript types](https://github.com/gfx687/pomodoro-timer/blob/web-react-0.3.0/web-react/src/other/types.websocket.tsx), they are grouped into `OutgoingMessage` and `IncomingMessage`.

Request type | Response types
-|-
`TimerGetRequest`|`TimerStatusResponse` or `TimerNotFoundResponse`
`TimerStartRequest`|`TimerStatusResponse` or `TimerAlreadyExistsResponse`
`TimerPauseRequest`|`TimerStatusResponse` or `TimerNotFoundResponse`
`TimerUnpauseRequest`|`TimerStatusResponse` or `TimerNotFoundResponse`
`TimerResetRequest`|`TimerResetResponse`

Additionally:
- `TimerFinishedResponse` is sent by backend when the Timer is finished

### HTTP API

For the HTTP API contracts check [TypeScript types](https://github.com/gfx687/pomodoro-timer/blob/web-react-0.3.0/web-react/src/other/types.api.tsx).

- `/api/timers/chart-day` with query param `from=2025-08-25-03:00`
  - request specified day's timer data to draw charts page
  - note the timezone sent in the `from`, it is needed to correctly add chart tooltips