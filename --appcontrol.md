The MCP server exposes 9 read-only tools:
list_binaries
List tracked binaries with filters — unsigned-only, currently-running, first-seen-after date, path substring, or publisher ID.
get_binary
Get detailed info for one or more binaries by ID (batch with comma-separated IDs) — path, hash, signature, publisher, first-seen time, and running status.
list_processes
List currently running processes with binary ID, name, path, PID, and start time. Filterable by fields.
list_publishers
List code-signing publishers (certificate identities) — name, country, and linked binary/rule counts.
list_rules
List quarantine rules — blocked binaries and publishers with rule type and creation time.
query_history
Query security event history — binary first-seen events, quarantine blocks, alerts, and process starts. Filterable by event type, time range, and binary ID.
get_stats
Get service stats, current timestamp, and uptime/idle intervals showing when the PC was on, off, or idle.
get_monitoring
Get time-series resource metrics — system-wide (CPU, memory, disk, GPU, temps) or per-binary with top-N/min-value filtering to find heavy resource consumers.
get_hardware
Get CPU, GPU, and temperature sensor info for the monitored system.
All tools are read-only. The