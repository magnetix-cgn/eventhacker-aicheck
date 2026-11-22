# AI-Check release preparation

Request: EH-W-AICHECK-DEPLOY-001, issue #2, plan revision 2.0.
Updated: 2026-11-22. State: preparation only; CONTACT TOWER before final release.

## Baseline and scope

PR #1 merged to main as `1759a6f3666b34391ff331d69b7d36475e25bceb`.
The previous blanket no-merge statement is obsolete for that PR. This new
preparation candidate still requires review; do not merge or publish it in this run.
Prior test-deployment approval is recorded and remains acknowledged.

The static game needs no backend, runtime API, package installation or new VM.
JavaScript and CSS are local assets. A text wordmark replaces the external logo
request pending an approved brand asset supplied through Nextcloud AgentUp.
No logo was copied, generated or fetched from an unapproved source. The production
asset must have documented provenance and owner approval before replacement.

## Environment evidence and independent blockers

Read-only discovery through hosting_hetzner on 2026-11-22 established:

- The configured Hetzner token can read the eventhacker.de zone (status ok).
- Its cloud project returns an empty server list. This does not prove that other
  projects or non-cloud hosting have no servers.
- The local resolver returns NXDOMAIN for aicheck.eventhacker.de A and AAAA.
- The existing ai alias is reachable, but its Apache configuration cannot be
  fully inspected by the current account. No AI-Check directory/vHost was found
  in the inspected paths. It is not a confirmed destination for this application.
- The htki.de fallback address is only a rules-retrieval route, never a hosting
  assignment for AI-Check.

Exact server/project, authorized deployment account, isolated Apache vHost and
DocumentRoot, release root, lock/log ownership, backup owner, TLS provisioning,
DNS records and a reviewed activation procedure remain unconfirmed. Do not
invent paths or create infrastructure to fill these gaps. No target executable
activation script is installed or claimed tested until this route is confirmed.
The required xvxv-env/bin/python is absent; no Python command was used.

## Candidate validation and immutable bundle

Use the existing checkout and current branch; preserve unrelated work.

```sh
node --check assets/app.js
npm test
node scripts/prepare-release.cjs FULL_COMMITTED_HEAD_SHA NEW_EXTERNAL_OUTPUT_DIRECTORY
```

The build-only command rejects a dirty checkout, a SHA other than HEAD, existing
output, and non-regular assets. It exports exactly index.html, assets/app.js,
assets/app.css, assets/icon.svg and .htaccess from Git into release.tar, with per-file SHA-256
and archive checksum in manifest.json. It neither connects to a server nor
changes DNS, services or permissions. Keep its output outside Git. Re-run tests
on the exact committed candidate before presenting its SHA to Tower.

The Apache .htaccess declares a restrictive CSP with no unsafe-inline/eval and
connect-src none, plus security headers and no-store. The host must permit the
relevant overrides, load mod_headers and enable the Options directive. The
IfModule guard is not proof headers are active: missing headers are a failed
release verification, never an acceptable downgrade.

## Route to approve after hosting confirmation

1. Review candidate SHA/PR, tests, brand fallback and remaining acceptance checks.
2. Record exact hostname, server/project, deployment identity, isolated release
   root, DocumentRoot/current mapping, lock and audit-log path, backup ownership,
   TLS process and DNS values using hosting_hetzner. Capture existing DNS and
   deployment state before any approved mutation.
3. Prepare a repository-owned deployment command for those verified inputs.
   Require a clean checkout at the approved SHA, remote release identity check,
   exclusive server lock, checksum verification and a new immutable versioned
   asset directory. Expose no repository, tests, manifests or secrets publicly.
4. Record the previous current target. Activate only the approved release by
   an atomic current switch. Validate Apache configuration before any necessary
   controlled reload. Keep CI deployment manual; never edit target source code.
5. Verify HTTPS status, hostname/certificate, CSP and all security headers,
   exact JS/CSS content hashes, six mission examples, negative clearance cases,
   free request, local persistence/reset, mobile layout and keyboard behavior.
   Block unexpected third-party asset requests or console/CSP errors.
6. Record release SHA, checksums, timestamp and actual results in issue #2.
   Contact Tower with evidence and final decision request; do not label landed
   before acceptance is verified.

## Rollback to rehearse on the confirmed target

Under the same server lock, restore only the recorded previous current symlink
atomically, check Apache config if changed, and repeat external HTTPS/content
verification. Retain both release directories and audit records. On an initial
release with no previous target, use the reviewed initial-disable procedure;
do not invent a previous release or delete unrelated content. DNS rollback is
separate and must restore the captured RRSet values under the approved scope.

This sequence is reviewable but cannot be executed or called host-tested until
the exact target and procedure are established. CONTACT TOWER with this blocker.

## Acceptance ledger

- Node functional smoke tests: run against the candidate and record exact SHA.
- Strict CSP desktop/mobile Chromium: record actual local-browser evidence.
- Physical iOS/Safari: NOT TESTED.
- Screenreader: NOT TESTED.
- Hosted Apache header/TLS/rollback verification: BLOCKED, target unconfirmed.
- Production deployment and external publication: NOT PERFORMED.
