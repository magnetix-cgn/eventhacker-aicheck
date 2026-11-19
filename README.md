# Eventhacker AI-Check ✈

Eventhacker AI-Check ist ein eigenständiges Trainingsgame für klare AI-Requests, inspiriert von NatoCheck.

**Testflight 0.1:** 6 Missionen (Stage 1, Stage 2, Ready for takeoff, Abort, Request ID, RFC), ein eigener-Request-Trainer, Rückmeldung zu Kriterien, Beispiele und ein lokaler Flight log.

## Lokal spielen

Einfach einen lokalen Webserver im Repository-Verzeichnis starten:

    python3 -m http.server 8768

Danach http://localhost:8768 im Browser öffnen. Keine externen JavaScript-Bibliotheken, kein Backend, keine API-Schlüssel erforderlich.

## Regeln und Datenschutz

Die Prüfungen sind **einfache Regex-Heuristiken**; sie erkennen Textmuster, keine semantische RFC-Konformität. Eine Mission besteht erst bei mindestens 80 Punkten **und** erfüllten Pflichtkriterien. Es handelt sich weder um ein Audit noch um eine tatsächliche Freigabe. Echte Aktionen erfordern gesonderte Autorisierung.

Nur die besten Missionspunkte werden im Browser (localStorage) gespeichert. Eingegebene Request-Texte werden nicht gespeichert oder versendet. Das Eventhacker-Logo wird aus dem öffentlichen NatoCheck-Repository per HTTPS geladen.

Die Farbgebung folgt dem Eventhacker-Profil (Blau #00AEEF, Schwarz #0B0F14, Grau #2D2D33). Das Eventhacker-Logo verlinkt auf https://eventhacker.de/.

## RFC und Release

- RFC-Portal: https://rfc.eventhacker.de/
- RFC-Repository: https://github.com/magnetix-cgn/eventhacker-rfc
- Vorläufiges Mapping: docs/rfc-mapping.md
- Designreferenz: https://github.com/magnetix-cgn/natocheck

Die offizielle RFC-Entwicklungsseite beschreibt Branch/Review vor Merge. Sie enthält aktuell keinen verabschiedeten AI-Request-Normtext. Dieses Spiel ist ein **Trainingsentwurf**.

Geplante URL: https://aicheck.eventhacker.de/ — **noch nicht live**. Ein Commit oder Draft-PR beinhaltet keine Bereitstellung. DNS/HTTPS/Hosting und Deployment brauchen gesonderte Freigabe.

Mehr Show. Weniger Chaos. · Infrastructure Matters

Lizenz: MIT, siehe LICENSE.
