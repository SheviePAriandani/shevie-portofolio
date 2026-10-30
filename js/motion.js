/* Motion: GSAP + ScrollTrigger. Transform, opacity, clip-path and CSS variables only.
   If anything here fails, content stays visible (see failsafe at the bottom of each block). */
(function () {
  'use strict';

  var root = document.documentElement;
  var Site = window.Site || {};
  var reduce = !!Site.reduce, fine = !!Site.fine;
  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function ready() { root.classList.remove('motion-pending'); }
  function safe(name, fn, onFail) {
    try { fn(); } catch (err) {
      if (window.console) console.warn('[motion] ' + name + ' skipped:', err);
      if (onFail) { try { onFail(); } catch (e2) { /* ignore */ } }
    }
  }

  if (!gsap || !ScrollTrigger) { ready(); return; }
  gsap.registerPlugin(ScrollTrigger);

  var sections = $$('main > section');

  /* ---------- nav highlight driven by ScrollTrigger ---------- */
  safe('nav', function () {
    sections.forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec, start: 'top 50%', end: 'bottom 50%',
        onToggle: function (self) { if (self.isActive && Site.setActive) Site.setActive(sec.id); }
      });
    });
    Site.navDriver = 'scrolltrigger';
  });

  /* ---------- reduced motion: short fades only ---------- */
  if (reduce) {
    safe('reduced', function () {
      var els = $$('.cv-block, .exp-card, .item, .pull, .habits, .closing, .jr, .script');
      gsap.set(els, { opacity: 0 });
      ScrollTrigger.batch(els, {
        start: 'top 92%', once: true,
        onEnter: function (b) { gsap.to(b, { opacity: 1, duration: .25, stagger: .04, clearProps: 'opacity' }); }
      });
    }, function () { gsap.set('*', { clearProps: 'opacity' }); });
    ready();
    return;
  }

  /* ---------- helpers ---------- */
  function noTransition(els) { els.forEach(function (e) { e.style.transition = 'none'; }); }
  function restoreTransition(els) { els.forEach(function (e) { e.style.removeProperty('transition'); }); }

  /* mark things that should reveal on scroll */
  var revealEls = $$('[data-reveal], .cv-block, .exp-card, .jr, .script, .vid-caption, .jr-note, .jr-intro, .filters');
  var seen = [];
  revealEls = revealEls.filter(function (e) { if (seen.indexOf(e) > -1) return false; seen.push(e); return true; });
  /* cards inside a block reveal with the block, so skip nested duplicates */
  revealEls = revealEls.filter(function (e) { return !revealEls.some(function (o) { return o !== e && o.contains(e) && !e.classList.contains('exp-card'); }); });

  /* ---------- initial hidden states (set before ready() to avoid a flash) ---------- */
  var heads = $$('[data-sec-head]');
  var heroName = $('.hero-name');
  var heroBits = [];

  safe('initial-state', function () {
    gsap.set(revealEls, { opacity: 0, y: 34 });
    heads.forEach(function (h) {
      gsap.set($('.head-card', h), { x: -70, opacity: 0 });
      gsap.set($$('.ears i', h), { y: 26, opacity: 0 });
      gsap.set([$('.page-tag', h), $('.sticker-label', h)], { opacity: 0, scale: .6 });
    });

    /* split the hero name into words and letters; screen readers get the full name from aria-label */
    if (heroName) {
      var text = heroName.textContent.trim();
      heroName.setAttribute('aria-label', text);
      heroName.innerHTML = text.split(' ').map(function (w) {
        return '<span class="word" aria-hidden="true">' + w.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('') + '</span>';
      }).join(' ');
      gsap.set($$('.ch', heroName), { opacity: 0, yPercent: 70, rotate: function () { return gsap.utils.random(-14, 14); } });
    }
    heroBits = $$('.hero-copy .sec-meta, .hero-line, .hero-sub, .chips li');
    gsap.set(heroBits, { opacity: 0, y: 24 });
    gsap.set('.portrait-slot', { opacity: 0, scale: .88, rotate: -5 });
    gsap.set('.washi', { opacity: 0, scale: .4 });
    gsap.set('.portrait-sparkle', { opacity: 0, scale: 0 });
    gsap.set('.peek', { opacity: 0 });
    gsap.set('.peek-ears', { y: 16 });
    gsap.set('.sitcat', { opacity: 0, y: 30 });
    gsap.set('.scroll-cue', { opacity: 0 });

    var frame = $('#vid-frame');
    if (frame) {
      gsap.set(frame, { clipPath: 'inset(0% 100% 0% 0% round 32px)' });
      gsap.set('.vid-glow', { visibility: 'hidden' });
      gsap.set('.float', { opacity: 0, scale: 0 });
      gsap.set('.badge', { opacity: 0, scale: .3 });
      gsap.set('.topper', { opacity: 0, y: 24 });
      gsap.set('.tail-swing', { opacity: 0 });
      gsap.set('.br', { opacity: 0 });
    }
  }, function () {
    gsap.set('*', { clearProps: 'opacity,transform,visibility,clipPath' });
  });
  ready();

  /* ---------- hero entrance ---------- */
  var heroTl = gsap.timeline({ paused: true, defaults: { ease: 'back.out(1.7)' } });
  safe('hero', function () {
    heroTl
      .to($$('.ch', heroName), { opacity: 1, yPercent: 0, rotate: 0, duration: .7, stagger: .04 }, 0)
      .to($('.hero-copy .sec-meta'), { opacity: 1, y: 0, duration: .5 }, 0)
      .to($$('.hero-line, .hero-sub'), { opacity: 1, y: 0, duration: .6, stagger: .12 }, .5)
      .to($$('.chips li'), { opacity: 1, y: 0, duration: .5, stagger: .09 }, .75)
      .to('.portrait-slot', { opacity: 1, scale: 1, rotate: 0, duration: .8 }, .2)
      .to('.washi', { opacity: .92, scale: 1, duration: .5, stagger: .1 }, .7)
      .to('.portrait-sparkle', { opacity: 1, scale: 1, rotate: 25, duration: .6 }, .9)
      .to('.peek', { opacity: 1, duration: .01 }, .55)
      .to('.peek-ears', { y: 0, duration: .7, ease: 'elastic.out(1.1, .45)' }, .6)
      .to('.sitcat', { opacity: 1, y: 0, duration: .6 }, 1)
      .add(function () { var c = $('.sitcat'); if (c) c.classList.add('wag'); }, 1.35)
      .to('.scroll-cue', { opacity: 1, duration: .5 }, 1.3);
  }, function () { gsap.set('*', { clearProps: 'opacity,transform,visibility' }); });

  /* ---------- load curtain: short, skippable ---------- */
  var curtain;
  safe('curtain', function () {
    curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = '<div class="curtain-in"><div class="curtain-ball"><svg viewBox="0 0 52 52"><use href="#yarn"/></svg></div><p class="curtain-hi">Hello!</p><p class="curtain-skip">tap or press any key to skip</p></div>';
    document.body.appendChild(curtain);
    var ball = $('.curtain-ball', curtain);
    var tl = gsap.timeline({ onComplete: function () { curtain.remove(); } });
    tl.fromTo(ball, { x: -90, rotate: -360 }, { x: 0, rotate: 0, duration: .7, ease: 'power2.out' })
      .fromTo($('.curtain-hi', curtain), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3 }, .25)
      .add(function () { heroTl.play(); }, .85)
      .to(curtain, { yPercent: -100, duration: .6, ease: 'power3.inOut' }, .85);
    var skip = function () { tl.timeScale(5); };
    ['pointerdown', 'keydown'].forEach(function (ev) { window.addEventListener(ev, skip, { once: true }); });
    /* failsafe: never leave the curtain up */
    window.setTimeout(function () { if (curtain.parentNode) { curtain.remove(); heroTl.play(); } }, 3500);
  }, function () { heroTl.play(); });

  /* ---------- section headers ---------- */
  safe('section-heads', function () {
    heads.forEach(function (h) {
      var card = $('.head-card', h), ears = $$('.ears i', h);
      var tl = gsap.timeline({ paused: true });
      tl.to($('.page-tag', h), { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.5)' }, 0)
        .to(card, { x: 0, opacity: 1, duration: .7, ease: 'power3.out' }, .05)
        .to(ears, { y: -10, opacity: 1, duration: .35, ease: 'power2.out', stagger: .08 }, .3)
        .to(ears, { y: 0, duration: .7, ease: 'bounce.out', stagger: .08 }, .65)
        .to($('.sticker-label', h), { opacity: 1, scale: 1, duration: .5, ease: 'back.out(2.5)' }, .5);
      ScrollTrigger.create({ trigger: h, start: 'top 88%', once: true, onEnter: function () { tl.play(); } });
    });
  }, function () {
    gsap.set($$('.head-card, .ears i, .page-tag, .sticker-label'), { clearProps: 'all' });
  });

  /* ---------- staggered card reveal ---------- */
  safe('reveal', function () {
    ScrollTrigger.batch(revealEls, {
      start: 'top 90%', once: true,
      onEnter: function (batch) {
        noTransition(batch);
        gsap.to(batch, {
          opacity: 1, y: 0, duration: .75, ease: 'back.out(1.4)', stagger: .1, overwrite: true,
          onComplete: function () { gsap.set(batch, { clearProps: 'opacity,transform' }); restoreTransition(batch); }
        });
      }
    });
  }, function () { gsap.set(revealEls, { clearProps: 'opacity,transform' }); });

  /* ---------- video: wipe, brackets, parallax, tilt ---------- */
  var frame = $('#vid-frame'), stage = $('#stage');
  safe('video', function () {
    if (!frame) return;
    var tl = gsap.timeline({ paused: true });
    var brOffsets = { 'br-tl': [-18, -18], 'br-tr': [18, -18], 'br-bl': [-18, 18], 'br-br': [18, 18] };
    tl.set('.vid-glow', { visibility: 'visible' })
      .to(frame, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.05, ease: 'power3.inOut', onComplete: function () { gsap.set(frame, { clearProps: 'clipPath' }); } }, 0)
      .add(function () {
        $$('.br').forEach(function (b) {
          var key = Object.keys(brOffsets).filter(function (k) { return b.classList.contains(k); })[0];
          gsap.fromTo(b, { opacity: 0, x: brOffsets[key][0], y: brOffsets[key][1] }, { opacity: 1, x: 0, y: 0, duration: .8, ease: 'power3.out' });
        });
      }, .55)
      .to('.topper', { opacity: 1, y: 0, duration: .7, ease: 'back.out(1.6)' }, .9)
      .to('.tail-swing', { opacity: 1, duration: .5 }, .9)
      .to('.badge', { opacity: 1, scale: 1, duration: .8, ease: 'back.out(2)' }, 1)
      .to('.float', { opacity: 1, scale: 1, duration: .6, ease: 'back.out(2.4)', stagger: .1 }, 1.05);
    ScrollTrigger.create({ trigger: frame, start: 'top 82%', once: true, onEnter: function () { tl.play(); } });

    /* scroll parallax on the stickers (gentle) */
    $$('.float').forEach(function (f, i) {
      var d = parseFloat(f.getAttribute('data-depth')) || 1;
      gsap.to(f, {
        y: (i % 2 ? -1 : 1) * 36 * d, ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: .8 }
      });
    });

    if (fine) {
      /* 3D tilt, max 4 degrees */
      var rx = gsap.quickTo(frame, 'rotationX', { duration: .6, ease: 'power2.out' });
      var ry = gsap.quickTo(frame, 'rotationY', { duration: .6, ease: 'power2.out' });
      gsap.set(frame, { transformPerspective: 1400 });
      frame.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = frame.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 8);
        rx(-((e.clientY - r.top) / r.height - .5) * 8);
      });
      frame.addEventListener('pointerleave', function () { rx(0); ry(0); });

      /* pointer parallax on the stickers while the stage is visible */
      var active = false;
      ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', onToggle: function (s) { active = s.isActive; } });
      var movers = $$('.float-in').map(function (el) {
        var d = parseFloat(el.parentNode.getAttribute('data-depth')) || 1;
        return { d: d, x: gsap.quickTo(el, 'x', { duration: .9, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: .9, ease: 'power3.out' }) };
      });
      window.addEventListener('pointermove', function (e) {
        if (!active || e.pointerType === 'touch') return;
        var nx = e.clientX / window.innerWidth - .5, ny = e.clientY / window.innerHeight - .5;
        movers.forEach(function (m) { m.x(nx * 22 * m.d); m.y(ny * 16 * m.d); });
      }, { passive: true });
    }
  }, function () {
    gsap.set($$('#vid-frame, .vid-glow, .float, .badge, .topper, .tail-swing, .br'), { clearProps: 'all' });
  });

  /* ---------- paw-print trail (desktop margin) ---------- */
  safe('trail', function () {
    if (!window.matchMedia('(min-width: 1280px) and (hover: hover)').matches) return;
    document.body.style.position = 'relative';
    var trail = document.createElement('div');
    trail.className = 'trail';
    trail.setAttribute('aria-hidden', 'true');
    document.body.appendChild(trail);
    var H = document.documentElement.scrollHeight;
    var from = window.innerHeight * 0.85, to = H - 520, step = 270;
    var n = Math.max(0, Math.floor((to - from) / step));
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i');
      p.className = 'trail-paw';
      p.style.top = ((from + i * step) / H * 100).toFixed(3) + '%';
      p.style.left = (i % 2 ? 40 : 14) + 'px';
      p.style.transform = 'rotate(' + (172 + (i % 2 ? 12 : -12)) + 'deg)';
      trail.appendChild(p);
      (function (paw) {
        gsap.fromTo(paw, { opacity: 0, scale: .2 }, {
          opacity: .8, scale: 1, duration: .45, ease: 'back.out(2.2)', paused: true,
          scrollTrigger: { trigger: paw, start: 'top 82%', toggleActions: 'play none none reverse' }
        });
      })(p);
    }
  });

  /* ---------- buttons: boop ---------- */
  safe('boop', function () {
    var sel = '.btn, .fchip, .icon-btn, .more, .facade .play, .scroll-cue';
    var held = null;
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest(sel);
      if (!b || b.disabled) return;
      held = b;
      b.style.transition = 'none';
      gsap.killTweensOf(b);
      gsap.to(b, { scaleX: 1.1, scaleY: .84, duration: .1, ease: 'power2.out' });
    });
    function release() {
      if (!held) return;
      var b = held; held = null;
      gsap.to(b, { scaleX: 1, scaleY: 1, duration: .7, ease: 'elastic.out(1.2, .35)', onComplete: function () { gsap.set(b, { clearProps: 'transform' }); b.style.removeProperty('transition'); } });
    }
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
  });

  /* ---------- cursor: paw follower ---------- */
  safe('cursor', function () {
    if (!fine) return;
    var paw = document.createElement('div');
    paw.className = 'paw-cursor';
    paw.setAttribute('aria-hidden', 'true');
    document.body.appendChild(paw);
    var xTo = gsap.quickTo(paw, 'x', { duration: .4, ease: 'power3.out' });
    var yTo = gsap.quickTo(paw, 'y', { duration: .4, ease: 'power3.out' });
    var shown = false;
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { shown = true; gsap.set(paw, { x: e.clientX + 16, y: e.clientY + 16 }); gsap.to(paw, { opacity: .9, duration: .3 }); }
      xTo(e.clientX + 16); yTo(e.clientY + 16);
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var hot = e.target.closest('a, button, label, input, .card');
      gsap.to(paw, { scale: hot ? 1.35 : 1, rotate: hot ? -18 : 0, duration: .3, ease: 'back.out(2)', overwrite: 'auto' });
    });
    document.documentElement.addEventListener('mouseleave', function () { gsap.to(paw, { opacity: 0, duration: .2 }); shown = false; });
  });

  /* refresh trigger positions once fonts and images settle */
  var refresh = function () { ScrollTrigger.refresh(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener('load', refresh);
})();
