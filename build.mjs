// Static site build: renders src/content/<locale>.json through src/template.mjs
// into dist/<locale>/index.html. No dependencies. Usage: node build.mjs
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { site } from './site.config.mjs';
import { renderPage, renderNotFound } from './src/template.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });
await cp(join(root, 'src/styles.css'), join(dist, 'styles.css'));
await cp(join(root, 'CNAME'), join(dist, 'CNAME')).catch(() => {});
await cp(join(root, 'src/assets/favicon.ico'), join(dist, 'favicon.ico'));

// Cache-busting token for CSS/JS so visitors never get a stale stylesheet after a deploy.
site.assetVersion = createHash('md5').update(await readFile(join(root, 'src/styles.css'))).update(await readFile(join(root, 'src/assets/consent.js'))).digest('hex').slice(0, 8);

const enabled = Object.entries(site.locales).filter(([, l]) => l.enabled).map(([code]) => code);
const today = new Date().toISOString().slice(0, 10);

for (const code of enabled) {
  const t = JSON.parse(await readFile(join(root, `src/content/${code}.json`), 'utf8'));
  const sizes = JSON.parse(await readFile(join(root, `src/assets/${code}/sizes.json`), 'utf8'));
  const html = renderPage({ t, code, site, enabled, sizes });
  await mkdir(join(dist, code), { recursive: true });
  await writeFile(join(dist, code, 'index.html'), html);
  if (code === site.defaultLocale) await writeFile(join(dist, '404.html'), renderNotFound({ t, code, site }));
}

// Root: send visitors to the best enabled locale, default otherwise.
const def = site.defaultLocale;
await writeFile(join(dist, 'index.html'), `<!doctype html>
<html lang="${def}"><head><meta charset="utf-8">
<title>Huoleton</title>
<link rel="canonical" href="${site.origin}/${def}/">
<meta http-equiv="refresh" content="0; url=${def}/">
<script>
  var l = (navigator.language || '').slice(0, 2), ok = ${JSON.stringify(enabled)};
  location.replace((ok.indexOf(l) > -1 ? l : '${def}') + '/');
</script></head>
<body><a href="${def}/">Huoleton</a></body></html>
`);

await writeFile(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  enabled.map((c) => `<url><loc>${site.origin}/${c}/</loc><lastmod>${today}</lastmod>` +
    enabled.map((a) => `<xhtml:link rel="alternate" hreflang="${a}" href="${site.origin}/${a}/"/>`).join('') + `</url>`).join('\n') +
  `\n</urlset>\n`);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.origin}/sitemap.xml\n`);

console.log(`Built ${enabled.join(', ')} -> dist/`);
