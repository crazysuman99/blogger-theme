# Modular Blogger XML source

Blogger accepts one template XML file, not a folder of XML includes. This repository
keeps editable source fragments under `src/parts/` and assembles them into the single
root-level `theme.xml` that Blogger can import.

## Current fragments

| Order | File | Responsibility |
|---|---|---|
| 00 | `src/parts/00-document-start.xml` | XML declaration, doctype, opening html/head tags |
| 10 | `src/parts/10-head.xml` | Head metadata, skin placeholder, CSS/JS and third-party head dependencies |
| 20 | `src/parts/20-body.xml` | Body open, auto ads, error-page block and outer wrapper open |
| 21 | `src/parts/21-header-navigation.xml` | Top links, site logo/header widget and main navigation |
| 22 | `src/parts/22-homepage-signature.xml` | Homepage-only featured video, intro and network widgets |
| 23 | `src/parts/23-content-layout.xml` | Main blog post area and its layout |
| 24 | `src/parts/24-sidebar-layout.xml` | Sidebar widgets and related layout |
| 25 | `src/parts/24-footer-and-close.xml` | Footer widgets and closing document tags |

The fragments are cut only at existing, verified boundaries. This split does not
rewrite Blogger tags, widget IDs, conditions, scripts, styles or URLs. Every original
character remains in the same order, so concatenating the parts recreates the original
XML exactly.

## Build

Requires Python 3; no third-party packages.

```bash
python tools/build_theme.py
python tools/build_theme.py --check
```

The build command concatenates fragments in the order listed in
`tools/build_theme.py` with no extra whitespace and writes root-level `theme.xml`.
Run `--check` to verify the committed upload file is synchronized with source.

## Workflow

1. Edit the appropriate file under `src/parts/`.
2. Run `python tools/build_theme.py`.
3. Run `python tools/build_theme.py --check`.
4. Review the generated `theme.xml` diff.
5. Commit source fragments and generated output together, then open a PR.

Upload only the generated root `theme.xml` through Blogger → Theme → Edit HTML.
Back up the currently active Blogger theme first. Existing external CSS/JS URLs are
left unchanged by this modularization.

## Important

Do not edit root `theme.xml` directly as the source of truth. Edit source fragments,
rebuild, verify, and commit both source and generated output together. The source
fragments are a development convenience; Blogger itself still receives one XML file.
