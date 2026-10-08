# E5 local validation

Status: **ACCEPTED — E5/E6 core portability closeout**. Earlier dated partial records
are historical. User observed page/dashboard ticks at 06:42:29, 06:43:04 and 06:43:53,
settings persistence after refresh, removal/reinstallation and menu withdrawal/return.
These are functional observations, not internal timer-disposal proof.

Final checks: shared Clock/contracts, four-language codecs, freeze/boundary, packed
imports, native/WASM and React/Vue lifecycle proofs PASS; public plugin production
build, seven built-federation tests and package validation PASS. Battle: 40 frontend,
52 default Rust, 48 rollback Rust and two IPC tests; production frontend/native builds;
Rust formatting/check and exact consumer pins PASS. Both hosts use the unchanged
0.1.1 artifacts below; E5/E6 are accepted. Full evidence is owned by
[Battle acceptance](../../../battle-widget/docs/evidence/battlemoon-desktop/acceptance-summary.md).

Prior six-file installed asset equality is retained. Latest read-only inspection finds
both `/boot/optional/plugins/battlemoon-clock` and `/var/www/mos-plugins/battlemoon-clock`
absent, while cached Hub discovery remained at closeout. The user subsequently
clarified removal after testing and reinstalled it. Read-only follow-up confirms
both directories present and all six frontend hashes matching the accepted build/release.
No agent NAS changes/reinstallation were performed.
Internal sibling/resource cleanup is automated proof; live browser instrumentation
and cross-version update are not claimed. R4/P2-B2/hardware evidence stays open.

| Check | Result |
|---|---|
| Pinned Git preparation and both 0.1.1 SHA-512 artifacts | PASS; identical to Battle's source manifest/lock |
| Vite production federation, manifest, page/widget exports | PASS; host-only Vue, no native/backend binary |
| Built federation tests | PASS; seven tests: tick, two identities, independent suspension/disposal, config preservation/validation, stale cancellation, denied save, auth mapping and absent-host-Vue rejection |
| Shared Clock domain | PASS; ten tests |
| Shared React/Vue lifecycle mounts | PASS; both projections, sibling cleanup and stale fencing |
| Existing MOS staging wrapper versus Battle | PASS; two wrappers and exact installed package bytes/integrity |
| Debian all-architecture package, required files/modes, MD5/source archive | PASS |
| Fresh source archive replay, fresh Git clone and empty npm cache | PASS; identical built assets, packaging and mounted tests; not a committed MOS plugin checkout |
| Existing Hub templates | PASS; prior entries unchanged; verified Clock release now has its own catalog entry |
| Battle regression | PASS; 40 frontend tests and check:battlemoon exact pin check |
| New plugin dependency audit | PASS; zero findings after selecting Vue 3.5.43 / Vite 7.3.7 |
| Read-only actual MOS version/loader/settings inspection | PASS; MOS 0.6.0, frontend 0.1.286, host Vue 3.5.43 |
| Real MOS discovery, installation identity and settings-page rendering | PASS — user installation/screenshots; read-only asset hashes and manifest verified |
| Real MOS ticking, settings save/reload | PASS — user observed time progression and persistence after refresh |
| Real MOS dashboard and removal/reinstallation | PASS — user observed widget and menu withdrawal/return; sibling/internal cleanup tested automatically |
| Hub release publication | PASS — numeric 0.1.0 release, source-at-tag, Debian/checksums and Hub catalog published |
| Actual MOS cached discovery | PASS after user installation — real cached entry references published repository and all architecture |
| Rust/native builds and frozen cross-language regeneration | NOT RUN this session; implementation unchanged and historical G1 evidence retained |

Executable commands are in the [README](README.md). Built-federation tests load the
actual remoteEntry/chunks, but supply the MOS-style Vue/auth/settings environment as
a fixture. They do not stand in for an observed running MOS frontend.

Packaging defects found and fixed locally: WSL shell interpretation stripped Windows
backslashes; direct exec/normalized paths fix that. NTFS exposes 0777 directories,
which dpkg rejects; the package is now staged in a validated unique WSL `/tmp` directory
with directories 0755, files 0644 and root package ownership. Fresh archive replay
regresses both defects. Temporary staging is retained, not recursively deleted.

Source, bundles, archives and installed MOS files are separate identities. Shared
packages remain byte-identical 0.1.1. Debian/source archives can vary with timestamps;
their emitted checksums describe exact local output, not a reproducible binary promise.

Read-only remote commands inspected kernel/release metadata, manifest paths, compiled
loader and settings/installer source. No tokens/settings contents were collected; no
plugin, package, service, container or NAS mutation was performed. The current live
installer requires release metadata, one compatible Debian asset and source-at-tag;
putting a JSON entry into the Hub would not supply those missing release inputs.

The user completed live functional acceptance. No further E5/E6 action is required;
host changes remain separately authorized. No native/hardware outcome is inferred.

## Verified public release — 2026-10-08

- Public source: https://github.com/mfleming1290/mos-battlemoon-clock, numeric tag 0.1.0 at `a06361b0d40f26bf3a66da1ebe24ea2264efbb23`.
- Clean main Actions build `37784310383` and tagged build/release `37784419026`: PASS. Seven built-federation tests, manifest/version/integrity, absent Vue fallback and Debian/source checks pass on clean Ubuntu 24.04/Node 22. No private credentials or source checkout are needed.
- Release: https://github.com/mfleming1290/mos-battlemoon-clock/releases/tag/0.1.0. All five assets downloaded; unauthenticated Debian, source ZIP and GitHub source-at-tag URLs resolve. Checksums match actual bytes.
- `battlemoon-clock_0.1.0-1+mos-plugin_all.deb` (26,064 bytes): SHA256 `ef6206d71ac50a13212aeeb33f75d0cf040fd7b8ee5ba19d6030fa2309fb6bbc`; MD5 `008b35780e062dccf3b3b937ea618e5a`.
- `mos-battlemoon-clock-0.1.0-source.zip` (47,646 bytes): SHA256 `c1f90753da578c5574ab0e9a5fa851ada90055668e212c18f1eb07db44b68182`. The source archive is under MOS's 10 MiB limit and includes root configuration/settings, lock and the exact vendored archives, not caches or unrelated private runtime source.
- Sidecars: `.deb.md5`, `.deb.sha256`, `-source.zip.sha256`. Debian Architecture `all` denotes no native executable; required web assets and bundled third-party notices present, control contains no maintainer scripts, backend or dependencies. No arm64 native execution is claimed.
- Clock/contracts archives remain unchanged 0.1.1 at upstream `833075ac26cd8d5ebc67d131d3a77fa3a7a17c7e`. Their SHA256 values are `fc21c9289ab21af48277b002f1c1dd5965f1dff6fd750eb28f573aa9966fe889` and `f258196f0a2571db195c32057ef2a60f487a9d247a2eb3f8960869d81d5b8a7d`; SHA512 and manifest match Battle.
- Hub commit `4d60fb43c44f7c00bb254af0040b7119ae80602f`: only plugins/battlemoon-clock.json, images/battlemoon-clockIcon.svg and two MANIFEST lines. Published from a clean current-main clone; unrelated dirty local work was not pushed. Remote catalog/icon URLs resolve; existing entries preserved.
- Actual MOS read-only result: 0.6.0 / frontend 0.1.286 / API 20261003-1735, this Hub source configured, index count 378 with no Clock match, plugin not installed. Installed Hub/filter and plugin installer explicitly accept architecture `all`. Discovery is not a PASS until the cached index refreshes. Supported catalog update is POST `/api/v1/mos/hub/update`; it was NOT invoked. No configuration change, install, enable/disable, plugin update, removal or restart occurred.
- E5 remains PARTIAL; E6 BLOCKED on actual host integration. Battle Widget, shared runtime and High Command were not modified. Release artifacts are immutable; rollback before installation requires no NAS action. Later removal/install still needs explicit approval.

### User installation follow-up — 2026-10-08T13:34Z

- The user reported installation and supplied a screenshot showing the real Clock/settings page (time, locale/timezone, seconds/12-hour controls and Save). This establishes actual page rendering, not continued ticking, successful saving or cleanup.
- A second user screenshot shows the Hub card with the correct Clock name, description/icon and Installed badge: actual Hub UI discovery PASS. Rendering is intentionally inline on the MOS page (PluginPage.mjs); the Widget export renders only Clock inside MOS's dashboard container. No floating desktop window is intended.
- Subsequent read-only MOS inspection: cached index count 380 includes Battlemoon Clock and the correct public repository; installed source and frontend paths exist; manifest version 0.1.0, widget true. All six installed web-file SHA256 values match the clean public build, whose bytes independently match the downloaded Linux release package.
- Fresh public numeric-tag clone with credential helper disabled, fresh npm cache and no sibling repository: prepare, ci, build, seven tests, checks and Debian/source packaging PASS. Rebuilt web assets are byte-identical to published assets; shared 0.1.1 archives unchanged.
- No agent installation, catalog refresh, settings write, removal, update or service restart occurred. Earlier no-install/no-discovery observations above are chronological pre-install findings, superseded by this follow-up.
- Remaining E5: actual ticking, save/reload persistence, dashboard display, independent page/widget instances, unmount/reload cleanup and unrelated-state preservation. E6 remains blocked until required actual-host acceptance passes. Further NAS mutations need explicit approval; do not reinstall merely to obtain evidence.
