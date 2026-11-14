# Oli-Ohh Command Center

Static dashboard site for the Oli-Ohh launch (VTC Tradewings). Plain HTML pages, no build step. Hosted on GitHub Pages.

## Two versions

- **v2 (new design)** is in `v2/`. Open `v2/index.html`. It uses the brand maroon, has one shared sidebar, Ctrl/⌘+K page search and a mobile menu, and carries over all the content.
- **v1 (original)** is the root-level pages. Both versions use the same PIN and session, so moving between them doesn't ask you to sign in again.

### v2 structure

| Path | What it is |
|---|---|
| `v2/assets/v2.css` | Design system: colours, type, cards, tables, badges, progress bars |
| `v2/assets/v2.js` | App shell: page list (`PAGES`), sidebar, search, mobile menu, sign-in check |
| `v2/assets/fonts/` | Self-hosted Bricolage Grotesque and Instrument Sans (SIL Open Font License) |

To add a v2 page, copy any v2 page, keep its `<head>`, put the content in `<main class="page">`, and add one line to `PAGES` in `v2/assets/v2.js`. The sidebar and search update automatically.

## Structure (v1)

| Path | What it is |
|---|---|
| `index.html` | PIN login screen. This is the entry point. |
| `home.html` | Command Center hub. Every dashboard is linked from here. |
| `*.html` | Individual dashboards (channels, regions, strategy, ops) |
| `assets/app.js` | Shared shell loaded by every page: session guard, service worker, Home button |
| `assets/app.css` | Shared fixes: mobile tables, focus outlines, reduced motion |
| `assets/` | Icons, logo, login video and poster |
| `manifest.json`, `service-worker.js` | Install-as-app (PWA) and offline support |

## Adding a new page

1. Copy the `<!-- oo-shell -->` … `<!-- /oo-shell -->` block from any page into the new page's `<head>`.
2. Link the page from `home.html`.
3. Use lowercase file names with hyphens and no spaces (`west-up.html`, not `West UP.html`).

## PINs

PINs are stored as salted SHA-256 hashes in `index.html` (`MASTER_HASH`, `DEFAULT_USER_HASH`). To make a new hash, run:

```bash
python3 -c "import hashlib;print(hashlib.sha256(b'oliohh:NEWPIN').hexdigest())"
```

Akshay can also change his own PIN under **Settings / Reset PIN**. That change is saved on his device only.

> The PIN screen only keeps casual visitors out. Anyone who can open this repository can read the page contents. Truly private data needs a private repository or real server-side login.

## Updating the cache

After a big release, increase `VERSION` in `service-worker.js` (for example `oliohh-v3`). Installed devices will then drop their old cached pages.
