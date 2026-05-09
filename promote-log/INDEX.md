# Promote-city index

Running summary of `/promote-city` runs. One row per city; updated atomically
after each run. Status values:

- `promoted` — coverage flipped to `full` (≥10 live city layers)
- `partial` — module created but threshold not met; coverage stays `national-only`
- `skipped` — no discoverable endpoint or zero acceptable datasets
- `failed` — build broke; edits rolled back

| Slug | Status | Live layers | Promoted | Last run |
|---|---|---|---|---|
| amersfoort | partial | 1 city + 11 prov | — | 2026-05-08 |
| elburg | promoted | 11 city | 2026-05-09 | 2026-05-09 |
| helmond | skipped | 0 | — (already full/stub) | 2026-05-08 |
| lochem | promoted | 16 | 2026-05-09 | 2026-05-09 |
| rotterdam | promoted | 33 | 2026-05-08 | 2026-05-09 |
| tilburg | promoted | 21 | 2026-05-08 | 2026-05-08 |
