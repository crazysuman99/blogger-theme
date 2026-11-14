# Modular Blogger XML source

Blogger accepts one template XML file, not a folder of XML includes. This repository
therefore keeps editable source fragments under `src/parts/` and assembles them
into the single root-level `theme.xml` that Blogger can import.

## Current fragments

| Order | File | Responsibility |
|---|---|---|
| 00 | `src/parts/00-document-start.xml` | XML declaration, doctype, opening html/head tags |
| 10 | `src/parts/10-head.xml` | Head metadata, Blogger skin placeholder, CSS/JS and third-party head dependencies |
| 20 | `src/parts/20-body.xml` | Body markup, Blogger sections/widgets/includables and closing document tags |

These first boundaries are intentionally conservative. The first modularization pass
keeps every original character in the same order; it does not rewrite Blogger tags,
widget IDs, conditions, scripts, styles or URLs. The next safe step is to split the
large body fragment into smaller regions using explicit, verified boundaries.

## Build

Requires Python 3; no third-party packages.

```bash
python tools/build_theme.py
python tools/build_theme.py --check
```

The build command concatenates fragments in the order listed in
`tools/build_theme.py` with no extra whitespace and writes root-level `theme.xml`.
Run `--check` to verify that the committed upload file is synchronized with source.

## Blogger upload

Upload only the generated root `theme.xml` through Blogger → Theme → Edit HTML.
Back up the currently active Blogger theme first. External CSS/JS continue to load
from the existing jsDelivr URLs; this build does not alter those dependencies.

## Important

Do not edit root `theme.xml` directly as the source of truth. Edit the relevant
fragment, run the build, run `--check`, review the diff, then open a pull request.
The source fragments and generated `theme.xml` must be committed together.
