# Battlemoon Clock for MOS

Local plugin version **0.1.0**, exposing `./Plugin` (settings page) and `./Widget`
(dashboard Clock), using the existing MOS federation/settings/Debian workflow.
No backend, hooks, native binary, desktop runtime or second Vue runtime is included.
This folder is temporary local source within the catalog checkout, not a newly
created distribution repository. **RELEASE PUBLISHED / E5–E6 ACCEPTED.**
The public [mos-battlemoon-clock repository](https://github.com/mfleming1290/mos-battlemoon-clock)
now owns release source/builds; it vendors only the approved exact component archives
and host wrapper, so its clean Actions build needs no private upstream access.
The commands below describe retained local staging, not the published build inputs.

## Inputs and build

Requires Node 22+, npm, authenticated access to the private Battlemoon Git repository,
Git, tar and `dpkg-deb`. On this Windows machine packaging uses the existing
Ubuntu-24.04 WSL distribution; on Linux it uses native `dpkg-deb`. No environment
installation is performed. From this folder:

```powershell
npm run prepare:components
npm --prefix page ci --ignore-scripts
npm run build
npm test
npm run check
node tools/check.mjs H:/code/battle-widget
npm run package
```

The final command creates `dist/battlemoon-clock-0.1.0-1+mos-plugin_all.deb`,
`.deb.md5`, `.deb.sha256` and `battlemoon-clock-0.1.0-source.tar.gz`.
Assets install to `/var/www/mos-plugins/battlemoon-clock/`.
The source archive provides `page/plugin.config.js` and root `settings.json`;
MOS's installer needs both a release source archive and compatible `.deb`.
Dependencies, generated adapters, caches and assets are ignored in Git.

`battlemoon-source.json` pins Git revision
`833075ac26cd8d5ebc67d131d3a77fa3a7a17c7e` and exact SHA-512 npm identities for
Clock/contracts **0.1.1**. Preparation clones that revision and uses its standard
packing helper; both hashes must match before consumer files are replaced.
The reviewed MOS `ClockAdapter.mjs` is generated from that same source, not forked.
Clock formatting/configuration/session logic stays in the installed shared packages.
Battle and this plugin use identical archives; plugin version and source/package
identities are separate. Original shared artifacts remain unchanged.

## Host behavior

MOS owns authentication, durable settings, loading, widget placement and disposal.
The page reads/writes `/api/v1/mos/plugins/settings/battlemoon-clock` with MOS's
existing `authToken` (legacy token fallback); credentials are never recorded.
Settings POST preserves the other loaded fields because MOS replaces the whole JSON
value. Invalid locale/timezone is rejected by the shared Clock validator. Failed
load disables saving; denied/unavailable requests are visible. Widget settings
refresh on mount/reload, not via a new event bus. Save then reload dashboard widgets.
Page and widget have independent instance IDs and timer disposal. Unmount cancels
read ownership; cancelling a save does not guarantee the server did not persist it.

Host Vue **^3.5.0** is required. Federation has `import:false` and `generate:false`;
missing/incompatible sharing fails rather than loading a fallback Vue runtime.
The local test peer is 3.5.43, matching inspected MOS assets. No React is installed.

## Evidence and live gate

Local: seven tests exercise **built federation exports** with a host Vue
scope, two independent instances/ticking/suspension/disposal, settings validation
and whole-value preservation, stale read after replacement, error/auth mapping,
denied-save handling and rejection of a missing shared Vue runtime.
These are supporting integration tests, **not real MOS frontend observations**.
`check` verifies both npm lock/integrity values, manifest/exposes, absent Vue fallback,
portable bundles and existing Hub template shape. Package/source validation and fresh
source replay are recorded in [validation](validation.md).

Read-only SSH inspection found MOS **0.6.0**, build **20261004-0628**, stable,
frontend **0.1.286**, API **20261003-1735**, kernel **6.18.55-mos**, Vue **3.5.43**,
15 installed plugin manifests and no battlemoon-clock plugin. Installed loader
`/var/www/assets/usePlugins-BHC2rUQ8.js` supplies host Vue by full/major version and
loads `/_plugins/<name>/remoteEntry.js`, `./Plugin` and `./Widget`. Installed
`plugins.service.js:1735–1793` confirms settings are whole JSON values.
This inspection performed no installation or service mutation.

Conventions were checked against the existing GoSHS source/build workflow and the
MOS knowledge pack's `implementation/plugins/building-mos-plugins.md`,
`frontend-pages-widgets-locales.md`, `hub-release-packaging.md`, and original guide.
Those docs are static source evidence, not proof of this host's live Clock behavior.

### Required separate approval and smallest live procedure

1. Release/distribution is complete: numeric [0.1.0](https://github.com/mfleming1290/mos-battlemoon-clock/releases/tag/0.1.0),
   verified source-at-tag and frontend-only `.deb`/MD5/SHA256; Hub catalog is published.
   The user subsequently installed it. Read-only checks now confirm cached discovery,
   manifest 0.1.0 and all six assets matching the verified release. No agent refresh
   or installation was performed.
2. Check the discovered Clock entry points to that exact repository/release before installation.
3. Installation was performed by the user, and their screenshot proves the real
   settings page renders Clock. Before further settings/removal/update testing,
   approve the bounded live acceptance scope; preserve unrelated plugins/settings.
4. Confirm discovery, page render and ticking, dashboard widget, config/save/reload,
   independent page/widget instances, navigation/unmount cleanup and repeated reload.
   Inspect loaded artifact identity. Native/browser observations require actual host
   execution; automation fixtures cannot establish these rows.
5. If approved, exercise normal removal and confirm unrelated plugins/settings are
   unchanged. MOS has no assumed generic disable switch; use navigation/unmount plus
   its supported uninstall lifecycle. No backend services require restarting.

The procedure above is the retained acceptance/rollback reference, not pending work.
E5/E6 are accepted; reinstallation and all six installed frontend hashes are verified.
R4/P2-B2 native and physical display gates are unrelated and remain open.

## Rollback

Before installation no NAS rollback is needed. Leave local artifacts/source in place
or stop using them; restore no shared runtime/package bytes. After an authorized test,
use MOS's existing remove UI/API for this plugin only and retain its settings backup
if desired. Any rollback installation/removal still requires approval. Battle's
original runtime, inert Clock switch and prior artifacts remain intact.
