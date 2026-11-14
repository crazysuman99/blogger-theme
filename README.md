# Blogger Theme Repository

This repository is structured for the Blogger theme at `crazysuman99/blogger-theme`.

## Files
- `theme.xml` — Blogger template; upload this file's contents in Blogger Theme → Edit HTML.
- `css/skin-base.css` — extracted original Blogger skin CSS.
- `css/overall.css` — shared theme CSS.
- `css/item.css`, `css/listing.css`, `css/static-page.css`, `css/error-page.css` — conditional page stylesheet targets. These are placeholders because separate page-specific source CSS files were not available in the supplied working files; the existing styles remain in the two main CSS files.
- `js/theme.js` — consolidated custom theme JavaScript.

## GitHub upload
Upload the entire folder contents to the repository root (not the outer folder itself). Keep the directory names `css` and `js` unchanged. The template uses jsDelivr URLs on the `main` branch.

## Important compatibility note
Blogger's comment system, Blogger-generated dynamic data scripts, Google annotations, AdSense, AMP auto-ads, jQuery, and the existing credit script remain as separate dependencies because they contain Blogger runtime data or are third-party integrations. Only custom theme behavior that can safely run from a static external JS file was consolidated.

The XML is syntax-checked, but this package has not been live-tested by uploading it to Blogger. Keep a backup of the current repository/theme before replacing anything.


## Modular XML development

The editable XML source is now split into ordered fragments under `src/parts/`.
Blogger still receives one generated `theme.xml`; it cannot natively include
external XML files. Build it with:

```bash
python tools/build_theme.py
python tools/build_theme.py --check
```

See [docs/theme-modules.md](docs/theme-modules.md) for the source map and workflow.
