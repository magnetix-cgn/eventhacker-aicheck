# Eventhacker AI-Check

A static, local request-training game with six missions, free-request practice,
feedback, examples and browser-local score storage. It uses regex heuristics,
not semantic RFC certification or real authorization.

Open index.html through a local static web server. All runtime assets are local;
no user-entered text is transmitted or persisted. Only best mission scores are
stored in localStorage. The text wordmark is provisional; no external logo is
loaded. The Eventhacker and RFC links navigate only when selected by the user.

Run `npm test` for functional checks. See [release preparation](docs/deployment-runbook.md)
for the build-only pinned-SHA release bundle and remaining hosting gates.

The planned hostname is aicheck.eventhacker.de. No live deployment is claimed.
The training rules remain a draft; passing a game check never grants execution,
merge or publication permission. See [RFC mapping](docs/rfc-mapping.md).

License: MIT, see LICENSE.
