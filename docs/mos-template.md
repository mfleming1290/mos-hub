# MOS Docker Template Conversion Guide

Use this document as the source of truth when converting a Docker application, Docker Compose project, Dockerfile, repository, or uploaded project archive into a MOS Docker template or MOS Hub entry.

The goal is to produce a template that is faithful to the source project, portable across MOS systems, easy to review, and safe to install. Do not invent configuration that the source does not support.

## 1. What to produce

For a normal single-container application, produce one JSON file suitable for:

```text
/boot/config/system/docker/templates/<TemplateName>.json
```

For a MOS Hub repository, place that same Docker template under:

```text
docker/<TemplateName>.json
```

A basic Hub repository is:

```text
repo-root/
├── docker/
│   └── App.json
├── compose/
├── plugins/
├── images/
├── maintainer.json
└── README.md
```

Use `docker/` for single-container applications and `compose/<app>/` only when the application genuinely requires a multi-container stack.

## 2. Source precedence

Inspect the supplied project rather than guessing. Prefer authoritative runtime configuration in this order, while reconciling all relevant files:

1. `docker-compose.yml`, `docker-compose.yaml`, `compose.yml`, or `compose.yaml`
2. documented `docker run` command
3. `.env.example`, `.env.sample`, or documented environment table
4. README installation/deployment documentation
5. Dockerfile (`ENV`, `EXPOSE`, `VOLUME`, `ENTRYPOINT`, `CMD`, labels, user)
6. startup/entrypoint scripts when needed to determine required values or runtime behavior
7. other project documentation only when the above are insufficient

When files conflict, prefer the configuration the project's documented deployment path actually uses. Mention unresolved conflicts instead of silently choosing an arbitrary value.

## 3. Do not invent values

Never invent:

- ports
- protocols
- container paths
- environment variable names
- default values
- web UI URLs
- required capabilities
- devices
- GPU requirements
- privileged mode
- host networking
- passwords or tokens

Framework defaults are not evidence. If a port or path cannot be established from the source, leave it out and explain the uncertainty.

## 4. MOS Docker template shape

Use this structure for a normal MOS Docker template:

```json
{
  "name": "AppName",
  "repo": "owner/image:tag",
  "network": "bridge",
  "custom_ip": "",
  "default_shell": "bash",
  "privileged": false,
  "no_autoupdate": false,
  "extra_parameters": "--restart=unless-stopped",
  "post_parameters": "",
  "web_ui_url": "",
  "icon": "",
  "readme_url": "",
  "paths": [],
  "ports": [],
  "variables": [],
  "devices": [],
  "labels": [],
  "gpus": []
}
```

Only use fields and nested object shapes demonstrated by known-good MOS templates or MOS documentation. Do not create speculative schema fields.

## 5. Top-level conversion rules

### `name`

Use a stable, filesystem-friendly template/container name. Prefer the application's recognizable name without spaces when existing MOS examples follow that convention.

### `repo`

Use the exact container image from Compose or documented Docker instructions. Preserve a supplied tag. If the source intentionally omits a tag, do not manufacture one unless MOS requires it.

### `network`

Use the network mode explicitly required by the source. For ordinary published-port containers, `bridge` is the normal MOS value. Do not use `host` merely for convenience.

### `custom_ip`

Normally `""` unless the source or requested deployment requires a custom IP.

### `default_shell`

Use `bash` only when the image contains bash or the project demonstrates it. Otherwise use `sh` when appropriate.

### `privileged`

Set to `true` only when the source explicitly requires privileged mode.

### `no_autoupdate`

Normally `false` unless the application has a documented reason MOS must not automatically update the image.

### `extra_parameters`

Translate Docker runtime flags that do not have another MOS field. Examples may include:

- `--restart=unless-stopped`
- `--stop-timeout=30`
- `--platform=linux/amd64`

Do not duplicate ports, volumes, or environment variables here when MOS has dedicated fields for them.

### `post_parameters`

Leave empty unless a known-good MOS template or MOS documentation establishes a required use.

### `web_ui_url`

Only populate this when the source actually provides an HTTP/HTTPS web interface. MOS examples use forms such as:

```text
http://[IP]:[PORT:3000]
```

A game server port is not automatically a web UI.

### `icon`

Use an authoritative, stable image URL when one is available. Do not invent a path to an icon that does not exist. An empty string is preferable to a broken URL.

### `readme_url`

When available, link to the application's authoritative README or deployment documentation.

## 6. Paths / volumes

Convert persistent bind mounts or required volumes into `paths` entries:

```json
{
  "name": "Data",
  "mode": "rw",
  "host": "/mnt/cache/appdata/appname",
  "container": "/app/data",
  "description": "Persistent application data."
}
```

Rules:

- Preserve the exact container path from the source.
- Preserve read-only mounts as `"mode": "ro"`.
- For portable Hub templates, prefer the MOS documented host convention `/mnt/cache/appdata/<app>` for normal application data.
- Give separate semantically different mounts separate entries.
- Socket mounts such as `/var/run/docker.sock` should preserve their exact host and container paths and source access mode.
- Do not expose build-time-only paths as runtime mounts.
- If a source uses a relative Compose path such as `./data:/app/data`, convert the host side to an appropriate portable MOS host path while keeping `/app/data` unchanged.

## 7. Ports

Convert every required published runtime port into:

```json
{
  "name": "Web UI",
  "protocol": "tcp",
  "host": "3000",
  "container": "3000",
  "description": "Application web interface."
}
```

Rules:

- Preserve TCP vs UDP exactly.
- Preserve port ranges when the source uses ranges.
- Use the documented/default host port unless the user requested another.
- `EXPOSE` alone is supporting evidence, not always proof that a port must be published.
- If the application requires host and container ports to be identical, state that clearly in the port description and related environment variable description.
- If changing an environment variable also requires changing a MOS port mapping, document the coupling.

## 8. Environment variables

Convert supported runtime configuration into `variables` entries:

```json
{
  "name": "Friendly Name",
  "key": "VARIABLE_NAME",
  "value": "default",
  "mask": false,
  "description": "What the variable controls."
}
```

Rules:

- Preserve the exact environment key.
- Prefer the project's documented default value.
- Required-but-user-specific values should normally have an empty default and a description beginning with `REQUIRED.`
- Set `mask: true` for passwords, API keys, tokens, private keys, and other secrets.
- Do not mask ordinary IDs, names, ports, booleans, or non-secret configuration unless there is a specific reason.
- Include variables from `.env.example` when the documented Compose deployment loads that file.
- Also inspect startup scripts when necessary: a script may make an apparently optional variable mandatory.
- Do not add arbitrary environment variables simply because a base image or framework might support them.

### PUID / PGID

If the image supports PUID/PGID-style ownership variables, expose them. For portable MOS Hub templates, use the MOS documentation's recommended value of `500` when appropriate, but preserve a different value when the target deployment explicitly requires it.

## 9. Devices, labels, and GPUs

Leave these arrays empty unless the source requires them.

Do not assume a GPU because an application can optionally use one. Do not grant host devices or privileged access without source evidence.

When adding labels, use only the nested object structure confirmed by a known-good MOS template; never guess the label schema.

## 10. Docker vs Compose decision

Prefer a normal MOS Docker template when the deployable application is fundamentally one container, even if the upstream repository includes Compose merely as a convenience wrapper.

Use a MOS Compose template when multiple services are operationally required, such as an application that genuinely depends on its bundled database, cache, proxy, or worker services and cannot reasonably function as the intended deployment without them.

For Compose Hub entries, use:

```text
compose/<app>/
├── compose.yaml
├── .env          # optional
└── template.json
```

The MOS Hub compose metadata shape documented by MOS is:

```json
{
  "name": "Your App Name",
  "description": "Brief description",
  "icon": "https://example.com/icon.png",
  "webui": "http://{IP}:8080",
  "category": ["Utilities"],
  "readme_url": "https://example.com/docs"
}
```

Do not convert an optional companion service into a mandatory Compose stack unless the source says it is required.

## 11. MOS Hub repository rules

A starter Hub repository should contain:

```text
repo-root/
├── docker/
├── compose/
├── plugins/
├── images/
├── maintainer.json
└── README.md
```

`maintainer.json`:

```json
{
  "maintainer": "NAME",
  "donation": "DONATION URL"
}
```

Single-container templates go in `docker/`.

Compose stacks go in `compose/<app-name>/`.

Images may be stored in `images/` and referenced by a stable raw GitHub URL after the Hub repository is published.

A Hub repository can be added in MOS under:

```text
Settings → System Configuration → MOS Hub Settings
```

After adding the GitHub repository URL, refresh the Hub and verify that the template appears.

## 12. Validation checklist

Before returning a template, verify all of the following:

- JSON parses successfully.
- Image name matches the source.
- Runtime architecture constraints are preserved when relevant.
- Restart/stop behavior from Compose is preserved when practical.
- Every required runtime bind mount is represented.
- Container-side paths exactly match the source.
- Required published ports are represented.
- TCP/UDP protocols are correct.
- Required environment variables are represented.
- Defaults match the source unless intentionally adapted to a documented MOS convention.
- Passwords/tokens/secrets are masked.
- Required user-specific values are not filled with fake credentials.
- Web UI is blank unless one really exists.
- Privileged/device/GPU access is not granted without evidence.
- Coupled settings (for example an env port plus a published port) are documented.
- `readme_url` points to authoritative documentation when available.
- No unsupported MOS schema fields were invented.

## 13. Output behavior when invoked as `--mos`

When this document is used as the `--mos` instruction alias and the user supplies a Docker project/repository/archive:

1. Inspect the supplied source files.
2. Determine whether the application should be a Docker template or Compose template.
3. Extract image, architecture, mounts, ports, environment, runtime flags, devices, privileges, GPU needs, web UI, and docs URL.
4. Generate the MOS template using this specification.
5. Validate it against the source.
6. Clearly call out any unresolved ambiguity.
7. When asked for a file, create the finished `.json` or Hub-ready folder/archive rather than returning only a code block.
8. When the user supplies an existing MOS template, treat it as a schema/reference example but do not copy unrelated settings into the new template.

## 14. RuneScape: DragonWilds reference conversion

The starter template in this Hub was derived from the upstream `indifferentbroccoli/runescape-dragonwilds-server-docker` project.

Important source-specific facts preserved by the template:

- Image: `indifferentbroccoli/runescape-dragonwilds-server-docker`
- Platform: `linux/amd64`
- One UDP game port, default `7777`
- Host port, container port, and `DEFAULT_PORT` must match
- Persistent server files: `/home/steam/server-files`
- `OWNER_ID` is required
- `ADMIN_PASSWORD` is required
- `WORLD_PASSWORD` is optional
- `PUID` and `PGID` are required by the container startup script
- `UPDATE_ON_START` controls server-file updating
- Compose uses a 30-second stop grace period
- There is no documented HTTP web UI

This reference is useful as a regression test: another model following this file should be able to inspect the same upstream project and reproduce a materially equivalent MOS template without relying on the old MOS AI Template Maker plugin.
