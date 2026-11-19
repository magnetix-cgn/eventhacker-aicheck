# Eventhacker AI-Check · RFC-Mapping (Entwurf)

Status: 2026-11-19, **nicht verabschiedet**.

Die Eventhacker-RFC-Entwicklung dokumentiert Branch/Review vor Merge; eine Repository-Änderung ist **kein** Produktionsdeployment. Es existiert derzeit dort kein verabschiedeter AI-Request-Normtext. Die folgenden Spielregeln sind daher Trainingsheuristiken, keine formale Norm:

| Trainingsmission | Checks |
| --- | --- |
| Stage 1 | Phase, Thema, Ausgabe, Abnahme, keine Veröffentlichung |
| Stage 2 | Phase, Repo, Änderung, Tests, Merge-/Deploy-Grenze |
| Ready for takeoff | Freigabesignal, Ziel, Aktion, Vorprüfung, Scope |
| Abort | Stoppwort, Anhalten, keine Seiteneffekte, Status, Wiederaufnahme nur nach Freigabe |
| Request ID | Kennung, Issue, Repo, Phase, Abnahme |
| RFC | Regeländerung, Begründung, Kompatibilität, Review |

Die Regex-Prüfungen können falsch positive und falsch negative Ergebnisse erzeugen; selbst 100 Punkte haben **keine** Autorisierungswirkung. Die Mustertexte gelten nur als Beispiele.

Nächste RFC-Schritte: formellen AI Request Lifecycle entwerfen, normative Zustände und Berechtigungen festlegen, Kompatibilität und DE/EN prüfen, Review im RFC-Repo, versionierte Regeltests, danach eine separat freigegebene Veröffentlichung.

Quellen: https://github.com/magnetix-cgn/eventhacker-rfc und https://github.com/magnetix-cgn/natocheck.
