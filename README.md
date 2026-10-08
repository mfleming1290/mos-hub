# Personal MOS Hub

`plugins/` contains catalog entries pointing to actual plugin release repositories;
`docker/` contains container templates. Existing catalog entries are unchanged.

[Battlemoon Clock local staging](local-plugins/battlemoon-clock/README.md) is retained.
The [public plugin release](https://github.com/mfleming1290/mos-battlemoon-clock/releases/tag/0.1.0)
is now registered in the Hub. Release/build ownership is in that separate repository;
its vendored, integrity-verified component inputs need no private GitHub access.
The user has installed it; discovery, exact installed identity, page/dashboard ticks,
settings persistence and removal/reinstallation pass E5/E6 acceptance. Automated
lifecycle tests complement human observations; they are not inferred from screenshots.
See the local validation record; further NAS mutations require approval.
