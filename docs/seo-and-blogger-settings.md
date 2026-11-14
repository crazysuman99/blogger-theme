# SEO and Blogger settings checklist

This repository contains the Blogger theme source and the generated `theme.xml`.
Some search and monetization settings are controlled in Blogger, not by the theme.

## Theme-level changes in this update

- Use the Blogger canonical URL for the canonical link and social metadata.
- Keep one Open Graph title, URL, site name and page-type value per rendered page.
- Add dynamic Open Graph and X/Twitter descriptions and image fallbacks.
- Use a large-image X/Twitter card.
- Remove empty verification placeholders and obsolete Google+ references.
- Remove the obsolete `keywords` meta tags; major search engines do not use them for ranking.
- Use HTTPS for theme-owned links, schema.org types and supported third-party assets.
- Remove deprecated data-vocabulary.org breadcrumb microdata rather than output invalid structured data.

## Google Search Console

The site may already be verified using DNS. Do not add a fabricated `google-site-verification` value to the theme. If HTML-tag verification is later required, add the actual tag supplied by Search Console.

## Blogger robots.txt

Configure crawler rules in Blogger Settings → Crawlers and indexing → Enable custom robots.txt. Do not put robots.txt directives inside `theme.xml`. Before enabling custom rules, inspect the currently served `/robots.txt` and preserve Blogger's useful defaults. Submit the site's sitemap in Search Console:

`https://www.ksumanadhikari.com.np/sitemap.xml`

## AdSense ads.txt

Configure this in Blogger Settings → Monetization → Enable custom ads.txt. It is a plain-text file served at `/ads.txt`, not part of the Blogger theme XML.

For the Publisher ID currently present in this theme, the expected line is:

```text
google.com, pub-3386340410780049, DIRECT, f08c47fec0942fa0
```

After saving, verify that `https://www.ksumanadhikari.com.np/ads.txt` returns that exact line. AdSense may take time to recrawl the file.

## Values intentionally not guessed

- Google and Bing ownership verification tokens.
- A verified X/Twitter account handle for `twitter:site`.
- A real featured YouTube video ID. The existing widget still contains `VIDEO_ID`; replace it with the actual video ID in Blogger Layout when ready.

## Build and validation

Edit files in `src/parts/`, then run:

```bash
python tools/build_theme.py
python tools/build_theme.py --check
```

Upload only the generated root `theme.xml` to Blogger, after backing up the live theme. This repository update has not been tested by uploading it to a live Blogger site.
