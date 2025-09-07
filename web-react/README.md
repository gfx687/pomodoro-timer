Pomodoro timer web app using React and TypeScript.

## Versioning

### v0.4.0

Breaking changes:
- `TimerStatusResponsePayload` now has it's props properly in camelCase

Features:
- added a Long Break timer mode
- Hotkeys - "1-3" to change timer mode instead of "w"
- Charts page - start the day at 6 AM to show late night timers

Bugfixes:
- Charts page: fixed incorrect finished timer count

Misc:
- moved to Tailwindcss v4

Bundle size:
```
dist/index.html                                        0.51 kB │ gzip:  0.31 kB
dist/assets/favicon-C7cIVLi7.png                       4.60 kB
dist/assets/alert-DGzksTJF.mp3                        18.69 kB
dist/assets/roboto-v48-latin-regular-CNwBRw8h.woff2   20.61 kB
dist/assets/index-BoU5SG4E.css                        49.25 kB │ gzip:  3.86 kB
dist/assets/ChartsPage-B3Q6_erq.js                    42.60 kB │ gzip: 13.92 kB
dist/assets/index-DI3mnhO6.js                        262.10 kB │ gzip: 81.82 kB
```

### v0.3.1

Breaking changes:
- none

Features:
- ESC now exits Fullscreen mode
- added an option to show timer mode in the Fullscreen mode
- added pause indicator to Fullscreen mode
- added Keybinds info page

Bugfixes:
- Chart page: do not count timer finish if it was started yesterday

Bundle size:
```
dist/index.html                                        0.51 kB │ gzip:  0.31 kB
dist/assets/favicon-C7cIVLi7.png                       4.60 kB
dist/assets/alert-DGzksTJF.mp3                        18.69 kB
dist/assets/roboto-v48-latin-regular-CNwBRw8h.woff2   20.61 kB
dist/assets/index-ALvzcY7n.css                         3.99 kB │ gzip:  1.29 kB
dist/assets/index-D8aL0SP3.js                        298.07 kB │ gzip: 92.59 kB
```