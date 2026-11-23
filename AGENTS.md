# MOS Hub

- Purpose: Personal MOS catalog, plus local plugin development.
- Owns: `plugins/` catalog entries and `local-plugins/` source staging.
- Invariants: Catalog entries must reference actual release repositories. Local packages are not published or installed merely because builds pass. Preserve unrelated plugins and NAS state.
- Current checkpoint: Clock 0.1.0 release/catalog and E5/E6 acceptance pass: user observed page/dashboard ticks, settings persistence and removal/reinstallation/menu lifecycle. Reinstallation follow-up confirms both directories present and all six frontend hashes matching the accepted release. See `local-plugins/battlemoon-clock/validation.md`. Further NAS mutations require approval; public plugin repository owns release builds and distinct local replay/evidence staging is preserved.
- Work guidance: Use existing Vue federation and Debian package conventions; no backend is needed for Clock. See the local plugin README for build and acceptance procedure.
- MOS Desktop: `plugins/desktop.json` discovers public `mfleming1290/mos-desktop` numeric 0.1.1, an architecture-all M1 shell with shared Clock windows, taskbar and scoped browser layouts. Release/downloads and catalog/icon/manifest are verified; actual M1 update/workflow remains user-owned and unverified. M0 was accepted on MOS and remains rollback. No application backend/native streaming is included. Dedicated plugin repository owns compiled inputs/builds/releases; Hub owns metadata only. User granted standing publication approval for this project, not NAS installation or later implementation phases.
- MOS Stream: plugins/stream.json discovers public mfleming1290/mos-stream numeric0.1.0; standalone external Selkies URL viewer with shared MOS settings. Release CI, anonymous assets/hashes and catalogue/icon verification pass. Actual MOS installation and real playback remain user-controlled/unverified. No host mutation.
- Routes:
  - `local-plugins/AGENTS.md` — owns unpublished plugin source/build contracts; read when developing or packaging local plugins.
