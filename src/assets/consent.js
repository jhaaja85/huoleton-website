// Loads Google Analytics only after the visitor has accepted. The choice is remembered in localStorage.
(function () {
  var script = document.currentScript;
  var id = script.getAttribute('data-ga-id');
  var KEY = 'huoleton-consent';
  var banner = document.querySelector('.consent');

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  function clearGA() {
    document.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (n === '_ga' || n.indexOf('_ga_') === 0) {
        ['', '; domain=' + location.hostname, '; domain=.' + location.hostname].forEach(function (d) {
          document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  function choose(v) {
    write(v);
    banner.hidden = true;
    if (v === 'granted') loadGA(); else clearGA();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-consent]');
    if (b) return choose(b.getAttribute('data-consent'));
    if (e.target.closest('[data-consent-open]')) banner.hidden = false;
  });

  var stored = read();
  if (stored === 'granted') loadGA();
  else if (stored !== 'denied') banner.hidden = false;
})();
