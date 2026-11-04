/*
 * fixe post – gemeinsame Bausteine der Website
 * (Kopfzeile, Navigation, Produkt-Unternavigation, Fußzeile, Sprachumschaltung)
 *
 * NEUES PRODUKT HINZUFÜGEN
 *   1. Den Ordner „yours-truly“ kopieren (z. B. nach „meine-app“), Texte anpassen
 *      und in allen drei Seiten data-product="meine-app" setzen.
 *   2. Unten in PRODUCTS einen Eintrag ergänzen – „id“ = Ordnername.
 *   3. Optional: App-Icon (z. B. icon-128.png) in den Produktordner legen und unter „icon“ eintragen.
 *   Navigation, Produktübersicht auf der Startseite und die Datenschutz-Übersicht
 *   aktualisieren sich automatisch.
 */
var FP = (function () {
  'use strict';

  // ------------------------------------------------------------ Konfiguration
  var SITE = {
    name: 'fixe-post',
    monogram: 'fp',
    since: 2026
  };

  var PRODUCTS = [
    {
      id: 'yours-truly',                       // = Ordnername
      name: 'Yours Truly',
      monogram: 'Yt',                          // Text auf der Briefmarke (nur ohne Icon sichtbar)
      icon: 'yours-truly/icon-128.png',        // App-Icon, Pfad ab Website-Wurzel (optional)
      color: { light: '#b5462f', dark: '#e27d61' },
      tagline: { de: 'Postkarten aus deinen Fotos', en: 'Postcards from your photos' },
      description: {
        de: 'Gestalte aus deinen Fotos Postkarten mit Text, Stickern und Briefmarke – und verschicke sie digital.',
        en: 'Turn your photos into postcards with text, stickers and a stamp – and send them digitally.'
      },
      platforms: { de: 'iPhone & iPad', en: 'iPhone & iPad' },
      appStoreUrl: ''                          // nach dem Release eintragen, z. B. 'https://apps.apple.com/app/id1234567890'
    },
    {
      id: 'docquery',
      name: 'DocQuery',
      monogram: 'Dq',
      icon: 'docquery/icon-128.png',
      color: { light: '#1f5bd6', dark: '#6cb4ff' },
      tagline: { de: 'Frag deine Dokumente', en: 'Your docs, answered' },
      description: {
        de: 'Zieh ein PDF, eine Textdatei oder ein Foto hinein – DocQuery fasst es zusammen und beantwortet deine Fragen, privat auf deinem Mac.',
        en: 'Drop in a PDF, a text file or a photo – DocQuery summarizes it and answers your questions, privately on your Mac.'
      },
      platforms: { de: 'Mac', en: 'Mac' },
      appStoreUrl: ''
    }
  ];

  // Unterseiten jedes Produkts (Dateinamen im Produktordner)
  var PRODUCT_PAGES = [
    { id: 'overview', file: 'index.html',       de: 'Übersicht',   en: 'Overview' },
    { id: 'support',  file: 'support.html',     de: 'Support',     en: 'Support' },
    { id: 'privacy',  file: 'datenschutz.html', de: 'Datenschutz', en: 'Privacy' }
  ];

  // Ab so vielen Produkten werden sie in der Navigation in einem „Apps“-Menü gebündelt.
  var DROPDOWN_FROM = 4;

  // ------------------------------------------------------------ Sprache
  var root = document.documentElement;
  var lang = (function () {
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (q === 'de' || q === 'en') return q;
    return (navigator.language || '').toLowerCase().indexOf('de') === 0 ? 'de' : 'en';
  })();
  root.lang = lang;
  root.setAttribute('data-lang', lang);

  // ------------------------------------------------------------ Helfer
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function t(o) {
    return typeof o === 'string' ? esc(o)
      : '<span lang="de">' + esc(o.de) + '</span><span lang="en">' + esc(o.en) + '</span>';
  }
  function each(sel, fn) {
    var n = document.querySelectorAll(sel);
    for (var i = 0; i < n.length; i++) fn(n[i]);
  }
  function base() {
    var r = document.body.getAttribute('data-root');
    return r === null ? '.' : r;
  }
  function url(p) { return base() + '/' + p; }
  function currentProduct() {
    var id = document.body.getAttribute('data-product');
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function tint(p) { return ' style="--accent-l:' + esc(p.color.light) + ';--accent-d:' + esc(p.color.dark) + '"'; }
  function stamp(mono, cls) {
    return '<span class="stamp ' + (cls || '') + '" aria-hidden="true"><span class="stamp-inner">' + esc(mono) + '</span></span>';
  }
  // Produktzeichen: App-Icon, falls vorhanden – sonst Briefmarke mit Monogramm
  function mark(p, size) {
    if (p.icon) return '<img class="app-icon app-icon--' + size + '" src="' + esc(url(p.icon)) + '" alt="" aria-hidden="true" decoding="async">';
    if (size === 'nav') return '<span class="dot"></span>';
    return stamp(p.monogram, size === 'xs' ? 'stamp--xs' : '');
  }
  function current(on) { return on ? ' aria-current="page"' : ''; }

  function apply() {
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;
    each('[data-lang-btn]', function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === lang));
    });
    each('a[data-href]', function (a) {
      var parts = a.getAttribute('data-href').split('#');
      a.setAttribute('href', parts[0] + '?lang=' + lang + (parts[1] ? '#' + parts[1] : ''));
    });
  }

  // ------------------------------------------------------------ Kopfzeile
  function header() {
    var cur = currentProduct();
    var page = document.body.getAttribute('data-page');
    if (cur) {
      root.classList.add('tint');
      root.style.setProperty('--accent-l', cur.color.light);
      root.style.setProperty('--accent-d', cur.color.dark);
    }

    var items;
    if (PRODUCTS.length >= DROPDOWN_FROM) {
      items = '<details class="fp-dd"><summary' + (cur ? ' class="is-current"' : '') + '>Apps</summary><div class="fp-dd-panel">' +
        PRODUCTS.map(function (p) {
          return '<a class="tint"' + tint(p) + ' data-href="' + url(p.id + '/index.html') + '"' + current(cur && cur.id === p.id) + '>' +
            mark(p, 'nav') + '<span>' + esc(p.name) + '<small>' + t(p.tagline) + '</small></span></a>';
        }).join('') + '</div></details>';
    } else {
      items = PRODUCTS.map(function (p) {
        return '<a class="fp-nav-link tint"' + tint(p) + ' data-href="' + url(p.id + '/index.html') + '"' + current(cur && cur.id === p.id) + '>' +
          mark(p, 'nav') + esc(p.name) + '</a>';
      }).join('');
    }
    items += '<a class="fp-nav-link" data-href="' + url('index.html#kontakt') + '">' + t({ de: 'Kontakt', en: 'Contact' }) + '</a>';

    var html =
      '<header class="fp-header"><div class="wrap fp-bar">' +
        '<a class="fp-brand" data-href="' + url('index.html') + '"' + current(page === 'home') + '>' +
          stamp(SITE.monogram, 'stamp--sm') + '<span class="fp-brand-name">' + esc(SITE.name) + '</span></a>' +
        '<nav id="fp-nav" class="fp-nav" aria-label="Navigation">' + items + '</nav>' +
        '<div class="lang-switch" role="group" aria-label="Sprache / Language">' +
          '<button type="button" data-lang-btn="de">DE</button><button type="button" data-lang-btn="en">EN</button></div>' +
        '<button type="button" class="fp-menu-btn" aria-expanded="false" aria-controls="fp-nav">' + t({ de: 'Menü', en: 'Menu' }) + '</button>' +
      '</div></header>';

    if (cur) {
      html += '<div class="fp-product-bar"><div class="wrap">' +
        '<a class="fp-product-id" data-href="' + url(cur.id + '/index.html') + '">' + mark(cur, 'xs') + esc(cur.name) + '</a>' +
        '<nav class="fp-tabs" aria-label="' + esc(cur.name) + '">' +
          PRODUCT_PAGES.map(function (pg) {
            return '<a data-href="' + url(cur.id + '/' + pg.file) + '"' + current(pg.id === page) + '>' + t(pg) + '</a>';
          }).join('') +
        '</nav></div></div>';
    }

    var slot = document.getElementById('fp-header');
    if (slot) slot.outerHTML = html;
    apply();
  }

  // ------------------------------------------------------------ Bausteine
  function productGrid() {
    return PRODUCTS.map(function (p) {
      return '<a class="fp-product-card tint"' + tint(p) + ' data-href="' + url(p.id + '/index.html') + '">' +
        mark(p, 'md') +
        '<span class="fp-pc-body">' +
          '<span class="fp-pc-name">' + esc(p.name) + '</span>' +
          '<span class="fp-pc-tag">' + t(p.tagline) + '</span>' +
          '<span class="fp-pc-desc">' + t(p.description) + '</span>' +
          '<span class="fp-pc-meta">' + t(p.platforms) + ' · ' +
            (p.appStoreUrl ? t({ de: 'Im App Store', en: 'On the App Store' })
                           : t({ de: 'Bald im App Store', en: 'Coming soon to the App Store' })) + '</span>' +
        '</span>' +
        '<span class="fp-pc-arrow" aria-hidden="true">→</span></a>';
    }).join('');
  }

  function privacyList() {
    return PRODUCTS.map(function (p) {
      return '<li><a data-href="' + url(p.id + '/datenschutz.html') + '">' + esc(p.name) + '</a></li>';
    }).join('');
  }

  function storeInfo() {
    var p = currentProduct();
    if (!p) return '';
    var action = p.appStoreUrl
      ? '<a class="btn" href="' + esc(p.appStoreUrl) + '" rel="noopener">' + t({ de: 'Im App Store laden', en: 'Download on the App Store' }) + '</a>'
      : '<span class="pill">' + t({ de: 'Bald im App Store', en: 'Coming soon to the App Store' }) + '</span>';
    return action + '<span class="platforms">' + t({ de: 'Für ' + p.platforms.de, en: 'For ' + p.platforms.en }) + '</span>';
  }

  function footer() {
    var y = new Date().getFullYear();
    return '<footer class="fp-footer"><div class="wrap">' +
      '<span>© ' + (y > SITE.since ? SITE.since + '–' + y : y) + ' ' + esc(SITE.name) + '</span>' +
      '<nav aria-label="Rechtliches / Legal">' +
        '<a data-href="' + url('impressum.html') + '">' + t({ de: 'Impressum', en: 'Legal notice' }) + '</a>' +
        '<a data-href="' + url('datenschutz.html') + '">' + t({ de: 'Datenschutz', en: 'Privacy' }) + '</a>' +
      '</nav></div></footer>';
  }

  function fill(id, html, replace) {
    var el = document.getElementById(id);
    if (!el) return;
    if (replace) el.outerHTML = html; else el.innerHTML = html;
  }

  function render() {
    fill('fp-products', productGrid());
    fill('fp-privacy-list', privacyList());
    fill('fp-store', storeInfo());
    fill('fp-footer', footer(), true);
    apply();
  }

  // ------------------------------------------------------------ Interaktion
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (!el.closest) return;
    var b = el.closest('[data-lang-btn]');
    if (b) {
      lang = b.getAttribute('data-lang-btn');
      apply();
      try { history.replaceState(null, '', '?lang=' + lang + location.hash); } catch (err) {}
      return;
    }
    var m = el.closest('.fp-menu-btn');
    if (m) {
      var open = m.closest('.fp-header').classList.toggle('is-open');
      m.setAttribute('aria-expanded', String(open));
      return;
    }
    each('.fp-dd[open]', function (d) { if (!d.contains(el)) d.removeAttribute('open'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') each('.fp-dd[open]', function (d) { d.removeAttribute('open'); });
  });

  return { header: header, render: render, products: PRODUCTS };
})();
