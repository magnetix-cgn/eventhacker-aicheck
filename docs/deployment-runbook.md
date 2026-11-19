# Eventhacker AI-Check — Stage-2-Deployment-Runbook (ENTWURF)

**Request ID:** EH-W-AICHECK-DEPLOY-001 · **Issue:** #2 · **Stand:** 2026-11-19  
**Freigabestatus:** Request pushback / Stage 2 **nur für Vorbereitung**. **Kein Ready for takeoff.**

Ziel: Für das statische Frontend aus dem [Draft PR #1](https://github.com/magnetix-cgn/eventhacker-aicheck/pull/1) einen nachvollziehbaren, reversiblen Release nach `aicheck.eventhacker.de` vorbereiten. Dieses Dokument ist eine Anleitung **für eine spätere, einzeln freigegebene Durchführung**. Nichts wird durch das Schreiben dieses Dokuments live geschaltet.

## 1. Tatsächlich geprüfter Stand

- Repository: `magnetix-cgn/eventhacker-aicheck`, Entwicklungsbranch `stage2/ai-check-testflight-mvp`.
- Statisches HTML/CSS/JavaScript in `index.html`; ohne Account, Runtime-API oder Backend.
- Sechs Missionen, eigene Requests und lokale Punkte in `localStorage`.
- GitHub Actions mit Node-Smoke-Tests: am 2026-11-19 für SHA `191ccc6f8050bc47444ff58ba55414fb1c5b8465` **erfolgreich** (zwei Runs).
- Extern geladenes Eventhacker-Logo: `raw.githubusercontent.com/magnetix-cgn/natocheck/main/assets/eventhacker-logo-white.webp`. Dafür wird beim Laden eine Netzwerkverbindung zu GitHub aufgebaut (IP/Browsermetadaten). **Vor Veröffentlichung** gewünschtes Logo und Lizenz/Brand-Freigabe prüfen und dann idealerweise lokal ausliefern.
- **Blocker:** Der aktuelle JavaScript-Code steht inline in `index.html`. Für eine restriktive Produktions-CSP (`script-src 'self'` ohne `unsafe-inline`) muss er vorab in eine lokale Datei ausgelagert oder mit sicheren Hashes verarbeitet werden. Die Auslagerung ist der bevorzugte Weg.
- Noch nicht bestätigt: tatsächlicher DNS-Verwalter, Host, Reverse-Proxy-Konfiguration, existierender SSL-Zertifikatsprozess, IPv6, iOS-Safari-Darstellung, Screenreader-Tests.

## 2. Release-Gates: MUST vor Ready for takeoff

- [ ] Aktuellen Code/PR reviewen, Freigabe für Merge auf `main` **separat** erhalten.
- [ ] `npm test` im Release-SHA grün, tatsächliche Browser-Smoke-Tests auf Desktop und iOS-Safari durchführen.
- [ ] Funktionale Tests: alle 6 Beispiele, absichtlich unvollständiger Stage-2-Request, Takeoff-Signal ohne Scope, Abort ohne Stop/Status, eigener Request, Zurücksetzen des lokalen Fortschritts.
- [ ] Accessibility: Tab-Reihenfolge, sichtbarer Focus, Labels, Screenreader-Ausgabe für Ergebnisse, 200%-Zoom und schmale Viewports prüfen; Kontraste überprüfen.
- [ ] CSP-Blocker beheben; keine Inline-Skripte/eval, keine unsicheren Dritt-Skripte.
- [ ] Logo-Abhängigkeit/Datenschutzhinweis prüfen und, wenn rechtlich/technisch möglich, Logo lokal hosten.
- [ ] RFC-Hinweis korrekt: Der Trainer ist ein **heuristischer Entwurf**, kein RFC-Auditor und keine Freigabeinstanz.
- [ ] DNS- und HTTPS-Ziel, Betreiber, Host-Zugriff, Backups und Rollback-Pfad festlegen.
- [ ] Sicherheits- und Datenschutzprüfung (Logs, Aufbewahrung, externe Requests, CSP/Permissions Policy).
- [ ] Freigabe mit explizitem `Ready for takeoff` inklusive **Release-SHA, Ziel-FQDN und genauem Scope** dokumentieren.

## 3. Hosting-Optionen (Entscheidung offen)

**Option A — statische Dateien auf bestehendem Eventhacker-Webserver:** minimaler zusätzlicher Stack; eigener isolierter vHost/DocumentRoot. Bevorzugt, **falls** vorhandene Infrastruktur/Verantwortlichkeiten und ein isolierter Release-Pfad dafür geeignet sind.

**Option B — separate kleine statische Hosting-Instanz:** bessere Trennung von der Eventhacker-Website; zusätzlicher DNS-/TLS-/Betriebsaufwand.

Vorentscheidung: keine neue VM nur für die statische Vorschau ohne belastbaren Grund. Zuerst bestehende Infrastruktur und deren Zuständigkeiten dokumentieren. Kein öffentlicher Status oder reale Host-Daten in Git.

## 4. Beispiel: vHost-Konzept, NICHT anwenden

Das folgende Nginx-Beispiel ist **nicht** produktionsfertig, solange CSP/Logo-Blocker ungelöst sind. Pfade und Zertifikatsverwaltung sind Platzhalter. Die tatsächliche Konfiguration ist durch das betreibende Team zu reviewen.

```nginx
server {
    listen 443 ssl http2;
    server_name aicheck.eventhacker.de;

    root /srv/eventhacker-aicheck/current;
    index index.html;
    autoindex off;

    # SSL-Zertifikate/ACME nach lokalem Betriebsstandard eintragen.
    # ssl_certificate     /etc/...;
    # ssl_certificate_key /etc/...;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "DENY" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    # Zielkonfiguration nach Auslagerung des Inline-JS und Hosting des Logos:
    add_header Content-Security-Policy "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'" always;

    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-store" always;
    }
}
```

**Vor Anwendung ergänzen:** HSTS nur nach Verifikation der HTTPS-Abdeckung; eindeutige Regelung für IPv4/IPv6, HTTP→HTTPS, TLS, Logs, Monitoring und CDN/Proxies. Beim Nginx-Beispiel beachten, dass `add_header`-Anweisungen in einem `location`-Block die Vererbung anderer Header beeinflussen können. Die Release-Konfiguration sollte die Security-Header konsistent im passenden gemeinsamen Kontext definieren und anschließend mit tatsächlichen HTTP-Antworten geprüft werden. Derzeit keine Empfehlung zur Übernahme dieses Snippets ohne Review.

## 5. Release-Plan nach separater Freigabe

1. Genehmigten und getesteten Git-Commit/Tag unveränderlich festhalten (`RELEASE_SHA`).
2. Einen nur lesbaren Release-Ordner `/srv/eventhacker-aicheck/releases/<sha>/` mit genau den freigegebenen statischen Assets vorbereiten. Keine `.git`-, Test- oder internen Dateien öffentlich ausliefern.
3. Vorhandene Live-Version (`previous`) und bestehende Konfiguration sichern; atomaren Symlinkwechsel auf `current` vorbereiten.
4. DNS/AAAA, Zertifikat, vHost und Header **nur im explizit freigegebenen Scope** konfigurieren.
5. Konfiguration testen (`nginx -t` o.ä.), kontrolliertes Reload, dann Smoke-Test gegen den tatsächlichen HTTPS-Host.
6. Verifizieren: Startseite HTTP 200, korrekter Titel/Logo, sechs Missionen, Free-Request, keine Browser-Console-/CSP-Fehler, keine Drittanbieter-Skripte, keine unerwarteten Requests, korrekte Caching-Header, Zertifikatskette und Redirect.
7. Ergebnisprotokoll mit Release-SHA, Zeit, Testergebnis und verantwortlicher Person in Issue #2 dokumentieren.

Diese Schritte beschreiben die **spätere** Durchführung, keine jetzt ausgeführte Aktion.

## 6. Rollback

Bei Regression, TLS-/CSP-Fehler oder unerwarteten Netzwerkanfragen: Traffic nicht weiter umstellen. Vorherigen `current`-Symlink auf die protokollierte, bekannte Release-Version zurücksetzen; Webserverkonfiguration prüfen und kontrolliert reloaden. Wenn DNS geändert wurde, TTL und DNS-Rücknahme separat beachten. Incident/Fehler mit Befunden dokumentieren und keine automatische erneute Freigabe annehmen. Für initiales Deployment ohne Vorgängerversion: neuen vHost deaktivieren und zur vorherigen DNS-/Proxy-Konfiguration zurückkehren.

## 7. Testprotokoll / Offene Punkte

| Bereich | Stand |
| --- | --- |
| GitHub CI auf Stage-2-Branch | ✓ Zwei erfolgreiche Runs, SHA s.o. |
| Interaktive Browser-Smokes / iOS Safari | Offen |
| WCAG / Screenreader | Offen |
| Inline-Script / strenge CSP | **Blocker** |
| Logo lokal / Drittanbieter-Request | **Zu prüfen** |
| DNS / TLS / Hosting-Betrieb | Nicht eingerichtet / nicht hier geprüft |
| Merge nach main | Nicht freigegeben |
| Produktiv-Deployment | **Nicht freigegeben** |

**Flightstatus:** *Pushback granted, holding short.* Keine Änderungen an Produktion.
