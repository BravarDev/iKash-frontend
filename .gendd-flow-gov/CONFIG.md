---
generator: gendd-flow-gov
kind: local-config
---

# Local GenDD configuration

This folder holds **machine-local** settings for the GenDD Agentic Governance CLI.

- **`.env`** — model provider and API-related environment variables (may contain secrets).
- **`config.yaml`** — named model profiles (non-secrets) for `gendd --model`.
  Edit or extend with `gendd add-model`.
- **`map_standards_config.json`** — optional globs for `gendd map-standards`. By default
  `include_paths` is empty, so only Cursor rules and skills are indexed; Markdown documentation
  is not included until you add patterns there (CLI flags still merge on top). Examples:
  `"docs/**/*.md"` for all Markdown under `docs/`, or `"README.md"` for the repo readme.
  `_discovered_markdown` (if present) is a hint list from `gendd init`; you may delete that key
  once you are happy with your globs.
- Do **not** commit this directory; it should be listed in `.gitignore`.

Regenerate or extend with `gendd init` or `gendd add-model`.