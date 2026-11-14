/* Oli-Ohh Command Center — shared app shell
 * Loaded (deferred) on every page. Handles:
 *  1. Session guard  — pages other than the login screen need an unlocked session
 *  2. PWA            — registers the service worker (offline + fast repeat loads)
 *  3. Navigation     — floating "Home" button on pages that have no way back
 *  4. Small UX fixes — external links open safely, images load lazily
 */
(function () {
  'use strict';

  var AUTH_KEY = 'oliohh_auth';
  var LOGIN_PAGES = ['', 'index.html', 'login.html'];

  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  var isLogin = LOGIN_PAGES.indexOf(file) !== -1;

  function storageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }

  // 1. Session guard -------------------------------------------------------
  if (!isLogin && storageGet(AUTH_KEY) !== '1') {
    var next = encodeURIComponent(file + location.search + location.hash);
    location.replace('index.html?next=' + next);
    return;
  }

  // 2. Service worker ------------------------------------------------------
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function () {});
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var html = document.documentElement;
    html.classList.add('oo-ready');

    // Logout: any link back to the login screen ends the session
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = (a.getAttribute('href') || '').split('?')[0].toLowerCase();
      if (href === 'index.html' || href === './' || href === 'login.html') {
        try { sessionStorage.removeItem(AUTH_KEY); } catch (err) {}
      }
    });

    // External links: new tab, no opener access
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="http"]'), function (a) {
      if (a.host !== location.host) {
        if (!a.target) a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    });

    // Lazy-load images below the fold
    Array.prototype.forEach.call(document.querySelectorAll('img:not([loading])'), function (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
    });

    // 3. Floating home button where the page has no route back
    if (!isLogin && file !== 'home.html') {
      var hasHome = document.querySelector('a[href="home.html"], a[href="./home.html"], a[href^="javascript:history.back"]');
      if (!hasHome) {
        var btn = document.createElement('a');
        btn.href = 'home.html';
        btn.className = 'oo-home-fab';
        btn.setAttribute('aria-label', 'Back to Command Center');
        btn.innerHTML = '<span aria-hidden="true">⌂</span><span class="oo-home-fab__txt">Home</span>';
        document.body.appendChild(btn);
      }
    }
  });
})();
