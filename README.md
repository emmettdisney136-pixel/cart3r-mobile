# CART3R MOBILE — v1.0.0

A standalone, iPhone-friendly Discord customization companion PWA.

## Important limitation

On a completely stock iPhone, iOS does not allow a website or ordinary app to inject themes, CSS, or plugins into the official Discord app. CART3R MOBILE therefore provides its own themed workspace, local companion tools, and a clearly labelled Discord-style mock preview. It does **not** modify Discord, automate a Discord user account, or request your Discord password/token.

## Features

- Responsive dark interface with Crimson, Midnight, Ocean, Emerald, and custom accent themes
- Local plugin toggles for markdown preview, timestamps, hex colors, snippets, and quick links
- Discord markdown preview and copy
- Unix timestamp generator using Discord's `<t:UNIX:F>` format
- Hex color picker
- Local snippets stored in browser storage
- Interface mockup for testing your palette
- PWA manifest and offline service worker
- No backend, paid hosting, account login, or secrets required

## Publish free from your iPhone with GitHub Pages

1. In the GitHub app or Safari, create a **public** repository named `cart3r-mobile`.
2. Upload the contents of this folder to the repository root. The `index.html` file must be at the root, not inside another nested folder.
3. Open the repository in Safari, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/(root)`, then save.
6. Wait for GitHub Pages to publish. Your URL will look like `https://YOUR-USERNAME.github.io/cart3r-mobile/`.
7. Open that URL in Safari. Tap **Share → Add to Home Screen**. If offered, enable **Open as Web App**.

GitHub Pages is free for public repositories. Do not upload Discord tokens, passwords, or private credentials. This project does not need any secrets.

## Local data

Preferences and snippets are saved in `localStorage` on the device/browser. Clearing Safari website data may erase them. No data is sent to a CART3R server.

## Files

- `index.html` — app layout
- `styles.css` — responsive visual theme
- `app.js` — navigation, settings, and utilities
- `manifest.json` — installable PWA metadata
- `sw.js` — offline cache
- `assets/icon.svg` — app icon

## License

MIT — see `LICENSE`.
