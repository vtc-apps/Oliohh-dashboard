/* Oli-Ohh Command Center v2 — app shell
 * One place defines every page (PAGES). The sidebar, mobile menu and the
 * Ctrl/⌘+K page search are all built from it, so adding a page = one line here.
 */
(function () {
  'use strict';

  var AUTH_KEY = 'oliohh_auth';

  // [file, title, group, short description, hidden-from-sidebar]
  var PAGES = [
    ['home.html', 'Command Center', 'Overview', 'Today’s numbers and everything else in one place'],
    ['milestone-100cr.html', 'Milestone 100cr', 'Overview', 'Priority, sampling and assigned tasks'],
    ['quarterly-plan.html', 'Quarterly plan', 'Overview', 'Targets for the next three months'],
    ['imc.html', 'VTC iMC', 'Overview', 'Operations, training and follow process'],
    ['inhouse.html', 'In-house center', 'Overview', 'Internal command view'],

    ['mt-regional.html', 'MT Regional', 'Channels', 'D2R North India regional accounts'],
    ['mt-standalone.html', 'MT Standalone', 'Channels', 'Standalone store report'],
    ['subd-norms.html', 'Sub-D norms', 'Channels', 'Sub-distributor guidelines'],
    ['quick-commerce.html', 'Quick commerce', 'Channels', 'Blinkit, Zepto and Instamart'],
    ['ecommerce.html', 'E-commerce', 'Channels', 'Online marketplaces'],
    ['meesho-listing.html', 'Meesho listing', 'Channels', 'Meesho storefront status'],
    ['lindt-operations.html', 'Lindt operations', 'Channels', 'Oli-Ohh × Lindt e-commerce'],
    ['channel-classification.html', 'Channel classification', 'Channels', 'Channel definitions', true],

    ['ncr.html', 'Delhi NCR', 'Regions', 'Activation status — core hub'],
    ['chandigarh.html', 'Chandigarh', 'Regions', 'Activation status'],
    ['gujarat.html', 'Gujarat', 'Regions', 'Activation status'],
    ['west-up.html', 'West UP', 'Regions', 'Activation status'],

    ['instagram.html', 'Instagram', 'Marketing', 'Reach, views and followers'],
    ['shopify.html', 'Shopify', 'Marketing', 'Store sales performance'],
    ['performance.html', 'Q-com performance', 'Marketing', 'Quick-commerce ad and sales metrics'],
    ['review.html', 'Reviews', 'Marketing', 'Customer review feed'],

    ['3-tier-launch.html', '3-tier launch', 'Strategy', 'Awareness, soft launch, scale-up'],
    ['prelaunch-tasks.html', 'Pre-launch tasks', 'Strategy', 'Launch readiness tracker'],
    ['launch-ceremony.html', 'Launch ceremony', 'Strategy', 'Grand launch'],
    ['strategic-core.html', 'Strategic core', 'Strategy', 'Core strategy model'],
    ['margin-structure.html', 'Margins', 'Strategy', 'Scheme and margin summary'],
    ['about.html', 'Product', 'Strategy', 'Pasta kit specs and price parity'],
    ['meeting-highlights.html', 'Meeting highlights', 'Strategy', 'Strategic product launch framework', true],

    ['suggestion.html', 'Suggestions', 'Tools', 'Send an idea to the team'],
    ['transcription.html', 'AI transcription', 'Tools', 'Turn meeting audio into notes']
  ];
  window.OO_PAGES = PAGES;

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var isLogin = file === 'index.html' || file === '';

  // ---- session guard -------------------------------------------------------
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  if (!isLogin && ssGet(AUTH_KEY) !== '1') {
    location.replace('index.html?next=' + encodeURIComponent(file + location.search + location.hash));
    return;
  }

  // ---- service worker (root SW covers /v2/) ---------------------------------
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('../service-worker.js').catch(function () {}); });
  }

  if (isLogin) return;

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  function buildShell() {
    var body = document.body;
    var main = document.querySelector('main');
    if (!main) return;
    main.id = main.id || 'content';

    // sidebar
    var groups = [];
    PAGES.forEach(function (p) {
      if (p[4]) return;
      var g = groups.filter(function (x) { return x.name === p[2]; })[0];
      if (!g) { g = { name: p[2], items: [] }; groups.push(g); }
      g.items.push(p);
    });
    var navHtml = groups.map(function (g) {
      return '<div class="nav-group"><span>' + esc(g.name) + '</span>' + g.items.map(function (p) {
        var cur = p[0] === file ? ' aria-current="page"' : '';
        return '<a class="nav-link" href="' + p[0] + '"' + cur + '>' + esc(p[1]) + '</a>';
      }).join('') + '</div>';
    }).join('');

    var side = el('aside', { class: 'app-side', 'aria-label': 'Main navigation' },
      '<a class="app-brand" href="home.html"><img src="../assets/icon-192.png" alt=""><span><b>Oli-Ohh</b><small>Command Center</small></span></a>' +
      '<button class="app-search" type="button" data-open-search><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Find a page<kbd>' + (isMac ? '⌘K' : 'Ctrl K') + '</kbd></button>' +
      '<nav class="app-nav">' + navHtml + '</nav>' +
      '<div class="app-side-foot"><a href="../home.html" title="Open the previous design">Old version</a><a href="index.html" data-logout>Log out</a></div>');

    var top = el('div', { class: 'app-top' },
      '<button type="button" aria-label="Open menu" data-open-nav><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<b>Oli-Ohh</b>' +
      '<button type="button" class="app-top-search" aria-label="Find a page" data-open-search><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>');

    var scrim = el('div', { class: 'app-scrim', 'data-close-nav': '' });
    var wrap = el('div', { class: 'app-main' });
    main.parentNode.insertBefore(wrap, main);
    wrap.appendChild(top);
    wrap.appendChild(main);
    body.insertBefore(side, body.firstChild);
    body.appendChild(scrim);

    // keep the current link in view
    var cur = side.querySelector('[aria-current="page"]');
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
    // page title in tab
    var me = PAGES.filter(function (p) { return p[0] === file; })[0];
    if (me) document.title = me[1] + ' · Oli-Ohh';

    buildPalette();
  }

  // ---- page search (command palette) -------------------------------------
  var pal, palInput, palList, palItems = [], palSel = 0;
  function buildPalette() {
    pal = el('div', { class: 'modal palette', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Find a page' },
      '<div class="modal-box"><input type="search" placeholder="Type a page, channel or region…" aria-label="Search pages" autocomplete="off"><ul role="listbox"></ul></div>');
    document.body.appendChild(pal);
    palInput = pal.querySelector('input');
    palList = pal.querySelector('ul');
    palInput.addEventListener('input', renderPalette);
    palInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { palSel = Math.min(palSel + 1, palItems.length - 1); paintSel(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { palSel = Math.max(palSel - 1, 0); paintSel(); e.preventDefault(); }
      else if (e.key === 'Enter' && palItems[palSel]) { location.href = palItems[palSel][0]; }
    });
    pal.addEventListener('click', function (e) { if (e.target === pal) closePalette(); });
  }
  function renderPalette() {
    var q = palInput.value.trim().toLowerCase();
    palItems = PAGES.filter(function (p) { return !q || (p[1] + ' ' + p[2] + ' ' + p[3] + ' ' + p[0]).toLowerCase().indexOf(q) !== -1; });
    palSel = 0;
    palList.innerHTML = palItems.length ? palItems.map(function (p, i) {
      return '<li><a href="' + p[0] + '" role="option" data-i="' + i + '"><span><b>' + esc(p[1]) + '</b><br><span class="muted" style="font-size:.8125rem">' + esc(p[3]) + '</span></span><small>' + esc(p[2]) + '</small></a></li>';
    }).join('') : '<li class="empty">No page matches “' + esc(q) + '”. Try a channel, region or person.</li>';
    paintSel();
  }
  function paintSel() {
    Array.prototype.forEach.call(palList.querySelectorAll('a'), function (a, i) {
      a.setAttribute('aria-selected', i === palSel ? 'true' : 'false');
      if (i === palSel && a.scrollIntoView) a.scrollIntoView({ block: 'nearest' });
    });
  }
  function openPalette() { if (!pal) return; pal.classList.add('open'); palInput.value = ''; renderPalette(); setTimeout(function () { palInput.focus(); }, 10); }
  function closePalette() { if (pal) pal.classList.remove('open'); }

  // ---- global events --------------------------------------------------------
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-open-search],[data-open-nav],[data-close-nav],[data-logout],a[href]') : null;
    if (!t) return;
    if (t.hasAttribute('data-open-search')) { openPalette(); document.body.classList.remove('nav-open'); }
    else if (t.hasAttribute('data-open-nav')) document.body.classList.add('nav-open');
    else if (t.hasAttribute('data-close-nav')) document.body.classList.remove('nav-open');
    if (t.hasAttribute('data-logout')) { try { sessionStorage.removeItem(AUTH_KEY); } catch (err) {} }
    if (t.tagName === 'A' && t.host && t.host !== location.host) { t.target = '_blank'; t.rel = 'noopener noreferrer'; }
  });
  document.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable);
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openPalette(); }
    else if (e.key === '/' && !typing) { e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape') {
      closePalette(); document.body.classList.remove('nav-open');
      Array.prototype.forEach.call(document.querySelectorAll('.modal.open'), function (m) { m.classList.remove('open'); });
    }
  });

  // Simple modal helper for pages: <button data-modal="id"> opens <div class="modal" id="id">
  document.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('[data-modal]');
    if (o) { var m = document.getElementById(o.getAttribute('data-modal')); if (m) m.classList.add('open'); return; }
    var c = e.target.closest && e.target.closest('[data-close-modal]');
    if (c) { var mm = c.closest('.modal'); if (mm) mm.classList.remove('open'); return; }
    if (e.target.classList && e.target.classList.contains('modal') && !e.target.classList.contains('palette')) e.target.classList.remove('open');
  });

  if (document.readyState !== 'loading') buildShell();
  else document.addEventListener('DOMContentLoaded', buildShell);
})();
