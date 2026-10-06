// Page template. All user-facing strings come from the locale dictionary `t`.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const icons = {
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  check: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="m8.5 12.3 2.4 2.4 4.6-5"/>',
  file: '<path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M14 3.5V8h4M8.5 13h7M8.5 16.5h5"/>',
  gauge: '<path d="M4.5 17a8 8 0 1 1 15 0"/><path d="m12 13 3.5-4.5"/><circle cx="12" cy="13.5" r="1.2"/>',
  euro: '<path d="M17.5 7.2A6 6 0 1 0 17.5 16.8M5 10.5h8M5 13.5h8"/>',
  cloud: '<path d="M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"/>',
  devices: '<rect x="3" y="5" width="13" height="9.5" rx="1.8"/><path d="M7 18.5h5M9.5 14.5v4"/><rect x="17.5" y="9" width="3.5" height="9.5" rx="1.2"/>',
  people: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.2a5.5 5.5 0 0 1 3 4.8"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  printer: '<path d="M7 9V4h10v5M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2"/><rect x="7" y="14" width="10" height="6.5" rx="1"/>',
};
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

const playGlyph = '<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26"><path fill="currentColor" d="M6 3.6v16.8a.7.7 0 0 0 1.05.6l13.4-8.4a.7.7 0 0 0 0-1.2L7.05 3a.7.7 0 0 0-1.05.6z"/></svg>';
const appleGlyph = '<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26"><path fill="currentColor" d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.15-2.8.85-3.5.85s-1.8-.8-3-.8c-1.5 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7 2-1.100 2.800-2.200c.9-1.300 1.200-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.800zM14.100 5.800c.6-.8 1.100-1.800.9-2.800-.9 0-2 .6-2.700 1.400-.6.700-1.100 1.700-.9 2.700 1 .1 2-.5 2.700-1.300z"/></svg>';

function storeButtons(t, site, extraClass = '') {
  const s = t.stores;
  const btn = (href, glyph, b) =>
    `<a class="store" href="${esc(href)}" aria-label="${esc(b.aria)}" rel="noopener">${glyph}<span><small>${esc(b.small)}</small><strong>${esc(b.name)}</strong></span></a>`;
  const out = [];
  if (site.links.googlePlay) out.push(btn(site.links.googlePlay, playGlyph, s.googlePlay));
  // Rendered only when an App Store link is configured in site.config.mjs.
  if (site.links.appStore) out.push(btn(site.links.appStore, appleGlyph, s.appStore));
  return `<div class="stores ${extraClass}">${out.join('')}</div>`;
}

function soonNotice(t, site, center) {
  return `<div class="soon ${center ? 'soon--center' : ''}">
    <span class="soon__badge">${esc(t.soon.badge)}</span>
    <strong>${esc(t.soon.title)}</strong>
    <span>${esc(t.soon.text)} <a href="${esc(site.links.support)}">${esc(t.soon.contact)}</a></span>
  </div>`;
}

const launchedOr = (t, site, center) =>
  site.launched ? storeButtons(t, site, center ? 'stores--center' : '') : soonNotice(t, site, center);

function points(list) {
  return `<ul class="points">${list.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`;
}

function phone(name, w, h, alt, cls = '') {
  return `<img class="phone ${cls}" src="../assets/${name}.webp" width="${w}" height="${h}" alt="${esc(alt)}" ${cls.includes('phone--') ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>`;
}

function story({ id, block, image, tone, reverse }) {
  return `
  <section class="story ${reverse ? 'story--reverse' : ''}" ${id ? `id="${id}"` : ''}>
    <div class="container story__grid">
      <div class="story__text">
        <p class="eyebrow">${esc(block.step)}</p>
        <h2>${esc(block.title)}</h2>
        ${block.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
        ${points(block.points)}
      </div>
      <div class="story__visual"><div class="stage stage--${tone}">${image}</div></div>
    </div>
  </section>`;
}

function jsonLd(t, code, site, url) {
  const logo = `${site.origin}/assets/logo-512.png`;
  const app = {
    '@type': 'SoftwareApplication',
    '@id': `${site.origin}/#app`,
    name: t.brand.name,
    alternateName: `${t.brand.name} – ${t.brand.tagline}`,
    description: t.meta.description,
    applicationCategory: t.meta.appCategory,
    operatingSystem: 'Android',
    inLanguage: code,
    url,
    image: logo,
    publisher: { '@id': `${site.origin}/#org` },
  };
  if (site.launched && site.links.googlePlay) app.installUrl = site.links.googlePlay;
  const graph = [
    { '@type': 'Organization', '@id': `${site.origin}/#org`, name: t.brand.name, url: site.origin + '/', logo },
    { '@type': 'WebSite', '@id': `${site.origin}/#site`, url: site.origin + '/', name: t.brand.name, inLanguage: code, publisher: { '@id': `${site.origin}/#org` } },
    app,
  ];
  // "<" is escaped so the JSON can never close the script tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

export function renderPage({ t, code, site, enabled }) {
  const url = `${site.origin}/${code}/`;
  const switcher = enabled.length > 1
    ? `<nav class="lang" aria-label="${esc(t.nav.languageLabel)}">${enabled.map((c) =>
        `<a href="../${c}/" hreflang="${c}" lang="${c}"${c === code ? ' aria-current="true"' : ''}>${esc(site.locales[c].label)}</a>`).join('')}</nav>`
    : '';
  const alternates = enabled.map((c) => `<link rel="alternate" hreflang="${c}" href="${site.origin}/${c}/">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${site.origin}/${site.defaultLocale}/">`;

  return `<!doctype html>
<html lang="${code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
<meta name="theme-color" content="#1d4a37">
<link rel="canonical" href="${url}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t.brand.name)}">
<meta property="og:title" content="${esc(t.meta.title)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${site.locales[code].ogLocale}">
<meta property="og:image" content="${site.origin}/assets/og.jpg">
<meta property="og:image:alt" content="${esc(t.meta.ogAlt)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(t.meta.title)}">
<meta name="twitter:description" content="${esc(t.meta.description)}">
<meta name="twitter:image" content="${site.origin}/assets/og.jpg">
<meta name="twitter:image:alt" content="${esc(t.meta.ogAlt)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<script type="application/ld+json">${jsonLd(t, code, site, url)}</script>
<link rel="icon" href="../favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" href="../assets/logo-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="../assets/logo-180.png">
<link rel="stylesheet" href="../styles.css">
</head>
<body>
<a class="skip" href="#main">${esc(t.nav.skip)}</a>
<header class="site-header">
  <div class="container site-header__row">
    <a class="brand" href="./" aria-label="${esc(t.brand.name)}">
      <img src="../assets/logo-180.png" width="40" height="40" alt="">
      <span class="brand__name">${esc(t.brand.name)}</span>
    </a>
    <nav class="main-nav" aria-label="${esc(t.nav.label)}">
      <a href="#${t.features.id}">${esc(t.nav.features)}</a>
      <a href="#${t.why.id}">${esc(t.nav.why)}</a>
      <a href="#${t.pro.id}">${esc(t.pro.eyebrow)}</a>
    </nav>
    ${switcher}
    <a class="btn btn--small" href="#${t.cta.id}">${esc(site.launched ? t.nav.download : t.soon.navLabel)}</a>
  </div>
</header>

<main id="main">
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__text">
        <p class="eyebrow">${esc(t.hero.eyebrow)}</p>
        <h1>${esc(t.hero.title)}</h1>
        <p class="lead">${esc(t.hero.lead)}</p>
        ${launchedOr(t, site, false)}
        ${site.launched ? `<p class="note">${esc(t.stores.note)}</p>` : ''}
      </div>
      <div class="hero__visual">
        <div class="stage stage--sand hero__stage">
          ${phone('app-koti', 598, 1239, t.hero.imageAlt, 'phone--front')}
        </div>
      </div>
    </div>
  </section>

  <section class="steps" aria-labelledby="steps-title">
    <div class="container">
      <h2 id="steps-title" class="visually-hidden">${esc(t.steps.title)}</h2>
      <ol class="steps__list">
        ${t.steps.items.map((s) => `<li><span class="steps__n">${esc(s.n)}</span><strong>${esc(s.name)}</strong><span>${esc(s.text)}</span></li>`).join('')}
      </ol>
    </div>
  </section>

  <section class="story story--wide">
    <div class="container">
      <div class="story__text story__text--wide">
        <p class="eyebrow">${esc(t.plan.step)}</p>
        <h2>${esc(t.plan.title)}</h2>
        <div class="cols">
          <div>${t.plan.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
          <div>${points(t.plan.points)}</div>
        </div>
      </div>
      <img class="banner" src="../assets/feature.webp" width="1794" height="876" alt="${esc(t.plan.imageAlt)}" loading="lazy" decoding="async">
    </div>
  </section>

  ${story({ block: t.remind, tone: 'mint', reverse: true, image: phone('app-koti', 598, 1239, t.remind.imageAlt) })}
  ${story({ block: t.record, tone: 'sand', image: phone('app-kuittaus', 813, 1627, t.record.imageAlt) })}
  ${story({ block: t.track, tone: 'mint', reverse: true, image: phone('app-tilastot', 823, 1795, t.track.imageAlt) })}
  ${story({ block: t.pts, tone: 'sand', image: phone('app-pts', 782, 1676, t.pts.imageAlt) })}

  <section class="features" id="${t.features.id}">
    <div class="container">
      <h2>${esc(t.features.title)}</h2>
      <ul class="features__grid">
        ${t.features.items.map((f) => `<li>${icon(f.icon)}<h3>${esc(f.name)}</h3><p>${esc(f.text)}</p></li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="why" id="${t.why.id}">
    <div class="container">
      <div class="why__head">
        <p class="eyebrow eyebrow--light">${esc(t.why.eyebrow)}</p>
        <h2>${esc(t.why.title)}</h2>
        <p class="lead">${esc(t.why.lead)}</p>
      </div>
      <ul class="why__grid">
        ${t.why.items.map((i) => `<li><h3>${esc(i.name)}</h3><p>${esc(i.text)}</p></li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="data">
    <div class="container">
      <h2>${esc(t.data.title)}</h2>
      <ul class="data__grid">
        ${t.data.items.map((i) => `<li><h3>${esc(i.name)}</h3><p>${esc(i.text)}</p></li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="pro" id="${t.pro.id}">
    <div class="container pro__grid">
      <div class="pro__text">
        <p class="eyebrow">${esc(t.pro.eyebrow)}</p>
        <h2>${esc(t.pro.title)}</h2>
        <p class="lead">${esc(t.pro.lead)}</p>
        <p class="note">${esc(t.pro.note)}</p>
      </div>
      <ul class="pro__cards">
        ${t.pro.items.map((i) => `<li>${icon(i.icon)}<h3>${esc(i.name)}</h3><p>${esc(i.text)}</p></li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="cta" id="${t.cta.id}">
    <div class="container cta__inner">
      <img src="../assets/logo-180.png" width="88" height="88" alt="${esc(t.brand.logoAlt)}">
      <h2>${esc(site.launched ? t.cta.title : t.cta.soonTitle)}</h2>
      <p>${esc(site.launched ? t.cta.text : t.cta.soonText)}</p>
      ${launchedOr(t, site, true)}
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container site-footer__row">
    <div class="site-footer__brand">
      <img src="../assets/logo-32.png" width="28" height="28" alt="">
      <span><strong>${esc(t.brand.name)}</strong> · ${esc(t.footer.tagline)}</span>
    </div>
    <nav class="site-footer__links" aria-label="${esc(t.footer.tagline)}">
      <a href="${esc(site.links.privacy)}">${esc(t.footer.links.privacy)}</a>
      <a href="${esc(site.links.deletion)}">${esc(t.footer.links.deletion)}</a>
      <a href="${esc(site.links.support)}">${esc(t.footer.links.support)}</a>
      ${site.analytics.gaId ? `<button type="button" class="linklike" data-consent-open>${esc(t.consent.settings)}</button>` : ''}
    </nav>
    <p class="site-footer__copy">${esc(t.footer.copyright)}</p>
  </div>
</footer>
${site.analytics.gaId ? `<div class="consent" role="dialog" aria-labelledby="consent-title" hidden>
  <strong id="consent-title">${esc(t.consent.title)}</strong>
  <p>${esc(t.consent.text)}</p>
  <div class="consent__btns">
    <button type="button" class="btn btn--small" data-consent="granted">${esc(t.consent.accept)}</button>
    <button type="button" class="btn btn--small btn--ghost" data-consent="denied">${esc(t.consent.decline)}</button>
  </div>
</div>
<script src="../assets/consent.js" data-ga-id="${esc(site.analytics.gaId)}" defer></script>` : ''}
</body>
</html>
`;
}

export function renderNotFound({ t, code, site }) {
  return `<!doctype html>
<html lang="${code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.notFound.title)} – ${esc(t.brand.name)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="stylesheet" href="/styles.css">
</head>
<body>
<main class="container" style="padding-block:96px;text-align:center">
  <img src="/assets/logo-180.png" width="72" height="72" alt="" style="margin:0 auto 24px;border-radius:16px">
  <h1 style="font-size:2.25rem">${esc(t.notFound.title)}</h1>
  <p class="lead" style="margin:16px auto 28px">${esc(t.notFound.text)}</p>
  <a class="btn" href="/${code}/">${esc(t.notFound.link)}</a>
</main>
</body>
</html>
`;
}
