/* Behaviour: nav, theme, hero cat, video, accordions, filters, checklist, lightbox. No GSAP needed here. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var CFG = window.SITE_CONFIG || {};

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function store(k, v) {
    try {
      if (v === undefined) return window.localStorage.getItem(k);
      window.localStorage.setItem(k, v);
    } catch (e) { /* storage can be blocked; the page still works */ }
    return null;
  }

  var Site = window.Site = { reduce: reduce, fine: fine, navDriver: null };

  /* ---------- theme ---------- */
  var themeBtn = $('#theme-btn');
  function applyTheme(t, save) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#231B3B' : '#FFF8F0');
    if (save) store('shevie-theme', t);
  }
  var saved = store('shevie-theme');
  var initial = saved === 'dark' || saved === 'light' ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(initial, false);
  themeBtn.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });

  /* ---------- nav ---------- */
  var menuBtn = $('#menu-btn'), links = $('#nav-links');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    links.classList.toggle('is-open', open);
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (menuBtn.getAttribute('aria-expanded') === 'true' && !e.target.closest('.nav')) setMenu(false);
  });

  var navLinks = $$('a[data-sec]', links);
  Site.setActive = function (id) {
    navLinks.forEach(function (a) {
      var on = a.getAttribute('data-sec') === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
  };
  /* fallback driver, used only if ScrollTrigger is not available */
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      if (Site.navDriver === 'scrolltrigger') return;
      entries.forEach(function (en) { if (en.isIntersecting) Site.setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section').forEach(function (s) { secObs.observe(s); });
  }
  Site.setActive('home');

  /* ---------- scroll thread (yarn ball) ---------- */
  var line = $('#thread-line'), ball = $('#thread-ball');
  var ticking = false;
  function paintThread() {
    ticking = false;
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    var w = line.parentNode.clientWidth;
    line.style.setProperty('--p', p.toFixed(4));
    ball.style.setProperty('--p', p.toFixed(4));
    ball.style.setProperty('--px', (p * w).toFixed(1));
  }
  function queueThread() { if (!ticking) { ticking = true; window.requestAnimationFrame(paintThread); } }
  window.addEventListener('scroll', queueThread, { passive: true });
  window.addEventListener('resize', queueThread);
  paintThread();

  /* ---------- pause loops when a section is off screen ---------- */
  if ('IntersectionObserver' in window) {
    var offObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-off', !en.isIntersecting); });
    }, { rootMargin: '80px 0px' });
    $$('.room').forEach(function (s) { offObs.observe(s); });
  }

  /* ---------- hero cat ---------- */
  var peek = $('#peek-cat'), bubble = $('#peek-bubble');
  if (peek) {
    var follow = fine && !reduce;
    var rafId = 0, px = 0, py = 0;
    function look() {
      rafId = 0;
      var r = peek.getBoundingClientRect();
      var cx = r.left + r.width * 0.5, cy = r.top + r.height * 0.55;
      var dx = px - cx, dy = py - cy, len = Math.hypot(dx, dy) || 1;
      var mag = Math.min(5, len / 70 * 5);
      peek.style.setProperty('--ex', (dx / len * mag).toFixed(2) + 'px');
      peek.style.setProperty('--ey', (dy / len * mag * 0.8).toFixed(2) + 'px');
    }
    if (follow) {
      window.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        px = e.clientX; py = e.clientY;
        if (!rafId) rafId = window.requestAnimationFrame(look);
      }, { passive: true });
    }
    (function blinkLoop() {
      var wait = follow ? 2400 + Math.random() * 2600 : 6000 + Math.random() * 3500;
      window.setTimeout(function () {
        if (!document.hidden) {
          peek.classList.add('is-blink');
          window.setTimeout(function () { peek.classList.remove('is-blink'); }, 150);
        }
        blinkLoop();
      }, wait);
    })();
    var bubbleTimer = 0;
    peek.addEventListener('click', function () {
      bubble.textContent = 'meow!';
      bubble.classList.add('show');
      peek.classList.add('is-blink');
      window.setTimeout(function () { peek.classList.remove('is-blink'); }, 200);
      window.clearTimeout(bubbleTimer);
      bubbleTimer = window.setTimeout(function () {
        bubble.classList.remove('show');
        window.setTimeout(function () { bubble.textContent = ''; }, 250);
      }, 1500);
    });
  }

  /* ---------- video ---------- */
  var eq = $('#eq');
  if (eq) {
    var seed = 7;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var bars = '';
    for (var i = 0; i < 30; i++) {
      bars += '<i style="--h:' + (0.2 + rnd() * 0.5).toFixed(2) + ';--d:' + (0.55 + rnd() * 0.7).toFixed(2) + 's;--dl:-' + (rnd() * 1.2).toFixed(2) + 's"></i>';
    }
    eq.innerHTML = bars;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(t) { t = Math.floor(t || 0); return pad(Math.floor(t / 3600)) + ':' + pad(Math.floor(t % 3600 / 60)) + ':' + pad(t % 60); }

  function loadPlayer() {
    var v = CFG.video || {}, screen = $('#vid-screen'), frame = $('#vid-frame'), fac = $('#facade');
    if (!screen || !fac) return;
    var el;
    if (v.provider === 'file' && v.src) {
      el = document.createElement('video');
      el.controls = true; el.playsInline = true; el.preload = 'metadata';
      el.setAttribute('aria-label', v.title);
      if (v.poster) el.poster = v.poster;
      var src = document.createElement('source');
      src.src = v.src;
      src.type = /\.webm$/i.test(v.src) ? 'video/webm' : 'video/mp4';
      el.appendChild(src);
      if (v.captions) {
        var tr = document.createElement('track');
        tr.kind = 'captions'; tr.src = v.captions; tr.srclang = 'en'; tr.label = 'English'; tr.default = true;
        el.appendChild(tr);
      }
      var rt = $('#rec-time');
      el.addEventListener('play', function () { frame.classList.add('is-playing'); });
      el.addEventListener('pause', function () { frame.classList.remove('is-playing'); });
      el.addEventListener('ended', function () { frame.classList.remove('is-playing'); });
      el.addEventListener('timeupdate', function () { if (rt) rt.textContent = fmt(el.currentTime); });
    } else {
      el = document.createElement('iframe');
      el.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?rel=0&autoplay=1&playsinline=1';
      el.title = v.title;
      el.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      el.allowFullscreen = true;
      el.referrerPolicy = 'strict-origin-when-cross-origin';
    }
    screen.appendChild(el);
    fac.remove();
    frame.classList.add('has-player');
    if (el.tagName === 'VIDEO') { var pr = el.play(); if (pr && pr.catch) pr.catch(function () {}); }
    el.focus();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('#facade')) loadPlayer();
  });

  /* ---------- accordions and "read more" ---------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.acc-btn');
    if (btn) {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.classList.toggle('is-open', open);
      return;
    }
    var more = e.target.closest('.more');
    if (more) {
      var on = more.getAttribute('aria-expanded') !== 'true';
      more.setAttribute('aria-expanded', on ? 'true' : 'false');
      more.textContent = on ? 'Read less' : 'Read more';
      var sum = document.getElementById(more.getAttribute('aria-controls'));
      if (sum) sum.classList.toggle('is-open', on);
    }
  });

  function checkClamps() {
    $$('.jr-sum').forEach(function (box) {
      var sum = $('.jsum', box), more = $('.more', box);
      if (!sum || !more || sum.classList.contains('is-open')) return;
      more.hidden = sum.scrollHeight <= sum.clientHeight + 1;
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(checkClamps); else window.addEventListener('load', checkClamps);
  window.addEventListener('resize', checkClamps);

  /* ---------- journal filters with FLIP ---------- */
  var list = $('#jr-list');
  if (list) {
    var cards = $$('.jr', list);
    var status = $('#jr-status');
    var chipsEl = $$('.fchip');
    chipsEl.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var key = chip.getAttribute('data-filter');
        chipsEl.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });

        var first = new Map();
        cards.forEach(function (c) { if (!c.hidden) first.set(c, c.getBoundingClientRect()); });
        var shown = 0;
        cards.forEach(function (c) {
          var match = key === 'all' || c.getAttribute('data-tags').split(' ').indexOf(key) > -1;
          c.hidden = !match;
          if (match) { shown++; if (c.style.opacity === '0') { c.style.opacity = ''; c.style.transform = ''; } }
        });
        if (status) status.textContent = 'Showing ' + shown + ' of ' + cards.length + ' journals';

        if (reduce || !list.animate) return;
        cards.forEach(function (c) {
          if (c.hidden) return;
          var f = first.get(c);
          if (!f) {
            c.animate([{ opacity: 0, transform: 'scale(.92) translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.34,1.4,.64,1)' });
            return;
          }
          var l = c.getBoundingClientRect();
          var dx = f.left - l.left, dy = f.top - l.top;
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
          c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.34,1.2,.64,1)' });
        });
      });
    });
  }

  /* ---------- habits checklist ---------- */
  var boxes = $$('input[data-habit]');
  if (boxes.length) {
    var counter = $('#check-count');
    var KEY = 'shevie-habits';
    var ticked = [];
    try { ticked = JSON.parse(store(KEY) || '[]'); } catch (e) { ticked = []; }
    if (!Array.isArray(ticked)) ticked = [];
    var refresh = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      if (counter) counter.textContent = n + ' of ' + boxes.length + ' ticked';
    };
    boxes.forEach(function (b) {
      b.checked = ticked.indexOf(Number(b.getAttribute('data-habit'))) > -1;
      b.addEventListener('change', function () {
        store(KEY, JSON.stringify(boxes.filter(function (x) { return x.checked; }).map(function (x) { return Number(x.getAttribute('data-habit')); })));
        refresh();
      });
    });
    refresh();
  }

  /* ---------- card extras: whiskers, tilt, story link ---------- */
  var whisk = '<svg class="whisk" viewBox="0 0 26 40" aria-hidden="true" focusable="false"><path d="M2 8Q14 6 24 2"/><path d="M2 20H25"/><path d="M2 32Q14 34 24 38"/></svg>';
  $$('.card').forEach(function (c) {
    c.insertAdjacentHTML('beforeend', whisk);
    if (fine && !reduce) {
      c.addEventListener('pointerenter', function () { c.style.setProperty('--tilt', ((Math.random() * 2.8) - 1.4).toFixed(2) + 'deg'); });
    }
  });
  $$('.story').forEach(function (s) {
    var target = document.getElementById(s.getAttribute('data-links'));
    if (!target) return;
    var on = function () { target.classList.add('is-linked'); }, off = function () { target.classList.remove('is-linked'); };
    s.addEventListener('pointerenter', on); s.addEventListener('pointerleave', off);
    s.addEventListener('focusin', on); s.addEventListener('focusout', off);
  });

  /* ---------- lightbox ---------- */
  var dlg = $('#lightbox');
  if (dlg && dlg.showModal) {
    var lbImg = $('#lb-img'), lbCap = $('#lb-cap');
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lightbox]');
      if (t) {
        lbImg.src = t.getAttribute('data-full');
        lbImg.alt = t.getAttribute('data-alt') || '';
        lbCap.textContent = t.getAttribute('data-cap') || '';
        dlg.showModal();
        return;
      }
      if (e.target === dlg) dlg.close();
    });
  }
})();
