# Huoleton website

Static site, no dependencies. `node build.mjs` renders `src/content/<locale>.json` into `dist/<locale>/`.

- `npm run serve` – build and preview at http://localhost:4173/fi/
- Copy lives only in `src/content/*.json`; layout in `src/template.mjs`; styles in `src/styles.css`.
- Add English: fill `src/content/en.json` with the same keys as `fi.json` (written, not machine-translated), then set `en.enabled: true` in `site.config.mjs`. The language selector and hreflang/sitemap appear automatically.
- Set the real domain in `site.config.mjs` (`origin`) and the App Store link when iOS exists.
- `tools/process-images.py` produced the transparent phone cutouts in `src/assets` from the supplied screenshots.
