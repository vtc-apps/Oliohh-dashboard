# Oli-Ohh Command Center

Static dashboard site for the Oli-Ohh launch (VTC Tradewings). Plain HTML pages, no build step. Hosted on GitHub Pages.

## Structure

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
