/* Renders the page content from data/*.js. Safe to run more than once. */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var CV = window.SITE_CV || {};
  var SHOP = window.SITE_SHOPPING || {};
  var JR = window.SITE_JOURNALS || [];
  var FILTERS = window.SITE_JOURNAL_FILTERS || [];
  var PHOTOS = window.SITE_PHOTOS || [];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function ico(name, cls) {
    return '<svg class="ico ' + (cls || '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  }
  function art(name, vb, fill, cls) {
    return '<svg class="art-svg ' + (cls || '') + '" viewBox="' + vb + '" aria-hidden="true" focusable="false"' +
      (fill ? ' style="--fill:' + fill + '"' : '') + '><use href="#' + name + '"/></svg>';
  }

  /* ---------- photo slots ---------- */
  function slot(id, cls) {
    var p = PHOTOS.filter(function (x) { return x.id === id; })[0];
    if (!p || p.hidden) return '';
    var parts = String(p.ratio || '4/3').split('/');
    var rw = parseFloat(parts[0]) || 4, rh = parseFloat(parts[1]) || 3;
    var style = 'aspect-ratio:' + rw + '/' + rh;
    if (!p.src) {
      if (p.optional) return '';
      return '<figure class="slot slot-empty ' + (cls || '') + '" style="' + style + '" data-slot="' + esc(id) + '">' +
        '<div class="slot-ph" role="img" aria-label="Photo placeholder">' +
        ico('camera', 'slot-ico') +
        '<span class="slot-ratio">' + esc(rw === 1200 ? '1200 x 630' : rw + ':' + rh) + '</span>' +
        String(p.spec).split(', ').map(function (t) { return '<span class="slot-spec">' + esc(t) + '</span>'; }).join('') + '</div></figure>';
    }
    var w = 1200, h = Math.round(w * rh / rw);
    var eager = id === 'hero-portrait';
    return '<figure class="slot ' + (cls || '') + '" style="' + style + '" data-slot="' + esc(id) + '">' +
      '<button class="slot-btn" type="button" data-lightbox data-full="' + esc(p.src) + '" data-alt="' + esc(p.alt) + '" data-cap="' + esc(p.caption) + '" aria-label="Open larger photo: ' + esc(p.alt) + '">' +
      '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" width="' + w + '" height="' + h + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async"></button>' +
      (p.caption ? '<figcaption class="hand">' + esc(p.caption) + '</figcaption>' : '') + '</figure>';
  }

  /* ---------- hero ---------- */
  function hero() {
    var h = CFG.hero || {};
    var colors = ['mint', 'butter', 'sky', 'blush'];
    var icons = ['book', 'grid', 'tag', 'brush'];
    var chips = (h.facts || []).map(function (f, i) {
      return '<li class="chip chip-' + colors[i % 4] + '"><span class="chip-k">' + esc(f.label) + '</span><span class="chip-v">' + esc(f.value) + '</span></li>';
    }).join('');
    return '<p class="hero-line">' + esc(h.line) + '</p>' +
      '<p class="hero-sub hand">' + esc(h.sub) + '</p>' +
      '<ul class="chips" aria-label="Quick facts">' + chips + '</ul>';
  }

  /* ---------- video ---------- */
  function videoState() {
    var v = CFG.video || {};
    var has = v.provider === 'file' ? !!v.src : !!v.id;
    var poster = v.poster;
    if (!poster) {
      var ps = PHOTOS.filter(function (x) { return x.id === 'video-poster'; })[0];
      if (ps && !ps.hidden && ps.src) poster = ps.src;
    }
    return { v: v, has: has, poster: poster };
  }

  function video() {
    var s = videoState(), v = s.v;
    if (!s.has) {
      return '<div class="vid-screen vid-empty">' +
        '<div class="vid-bg" aria-hidden="true">' + art('cat-sit', '0 0 140 160', '#FFD9C7', 'vid-bgcat') + '</div>' +
        '<div class="vid-msg"><p class="vid-soon">Introduction video coming soon</p></div>' +
        '<button class="play" type="button" disabled aria-disabled="true" aria-label="Play video (not available yet)">' + ico('play') + '</button>' +
        '</div>';
    }
    var bg = s.poster
      ? '<img class="fac-img" src="' + esc(s.poster) + '" alt="" width="1600" height="900" decoding="async">'
      : '<span class="fac-art" aria-hidden="true">' + art('cat-sit', '0 0 140 160', '#FFD9C7', 'fac-cat') + art('sparkle', '0 0 48 48', '#FFF1B8', 'fac-sp') + '</span>';
    return '<div class="vid-screen" id="vid-screen">' +
      '<button class="facade" type="button" id="facade" data-provider="' + esc(v.provider) + '" aria-label="Play video: ' + esc(v.title) + '">' +
      bg + '<span class="play" aria-hidden="true">' + ico('play') + '</span>' +
      '<span class="fac-title">' + esc(v.title) + '</span></button></div>';
  }

  function topper() {
    if (videoState().has) return '';
    return '<div class="sleeper" aria-hidden="true">' +
      art('cat-sleep', '0 0 180 84', '#FFD9C7', 'sleeper-cat') +
      '<span class="zz z1">z</span><span class="zz z2">z</span><span class="zz z3">Z</span></div>';
  }

  function script() {
    var v = CFG.video || {};
    return '<div class="script card">' +
      '<h3 class="script-h"><button class="acc-btn" type="button" id="script-btn" aria-expanded="false" aria-controls="script-panel"><span>Read the script</span>' + ico('chev', 'acc-chev') + '</button></h3>' +
      '<div class="acc-panel" id="script-panel" role="region" aria-labelledby="script-btn"><div class="acc-clip"><blockquote class="script-text">' + esc(v.script) + '</blockquote></div></div>' +
      '</div>';
  }

  /* ---------- CV ---------- */
  function cv() {
    var out = [];
    var photo = slot('cv-photo', 'cv-photo');
    var pdf = CFG.cvPdf
      ? '<a class="btn" href="' + esc(CFG.cvPdf) + '" download>' + ico('download') + '<span>Download CV (PDF)</span></a>'
      : '';

    out.push('<article class="cv-sheet" aria-label="Curriculum vitae of ' + esc(CFG.name) + '">');
    out.push('<span class="cv-rings" aria-hidden="true"></span>');
    out.push('<header class="cv-head">' + photo +
      '<div class="cv-id"><p class="hand cv-kicker">Curriculum vitae</p>' +
      '<h3 class="cv-name">' + esc(CFG.name) + '</h3>' +
      '<p class="cv-headline">' + esc(CV.headline) + '</p></div>' + (pdf ? '<div class="cv-actions">' + pdf + '</div>' : '') + '</header>');

    out.push('<div class="cv-grid">');

    out.push('<section class="cv-block cv-profile" aria-labelledby="cv-h-profile"><h4 id="cv-h-profile" class="cv-h">Profile</h4><p>' + esc(CV.profile) + '</p></section>');

    out.push('<section class="cv-block cv-edu" aria-labelledby="cv-h-edu"><h4 id="cv-h-edu" class="cv-h">Education</h4><ol class="timeline">' +
      (CV.education || []).map(function (e, i) {
        return '<li class="tl-item"><span class="tl-dot" aria-hidden="true"></span>' +
          '<p class="tl-period">' + esc(e.period) + '</p>' +
          '<p class="tl-school">' + esc(e.school) + '</p>' +
          '<p class="tl-detail">' + esc(e.detail) + '</p></li>';
      }).join('') + '</ol></section>');

    var tints = ['peach', 'lav', 'mint'];
    out.push('<section class="cv-block cv-exp" aria-labelledby="cv-h-exp"><h4 id="cv-h-exp" class="cv-h">Experience</h4><ul class="exp-list">' +
      (CV.experience || []).map(function (x, i) {
        var main = x.english || x.original;
        return '<li class="card exp-card tint-' + tints[i % 3] + '">' +
          '<span class="exp-ico" aria-hidden="true">' + art('paw', '0 0 48 48', '#FFF8F0') + '</span>' +
          '<div><p class="exp-role"' + (x.english ? '' : ' lang="id"') + '>' + esc(main) + '</p>' +
          (x.org ? '<p class="exp-org">' + esc(x.org) + '</p>' : '') +
          (x.english ? '<p class="exp-orig"><span class="sr-only">Original name: </span><span lang="id">' + esc(x.original) + '</span></p>' : '') +
          '</div></li>';
      }).join('') + '</ul></section>');

    var it = CV.internship;
    if (it && (it.company || it.role)) {
      out.push('<section class="cv-block cv-intern" aria-labelledby="cv-h-int"><h4 id="cv-h-int" class="cv-h">Internship</h4>' +
        '<div class="card exp-card tint-sky"><div>' +
        (it.role ? '<p class="exp-role">' + esc(it.role) + '</p>' : '') +
        (it.company ? '<p class="exp-org">' + esc(it.company) + (it.period ? ', ' + esc(it.period) : '') + '</p>' : '') +
        (it.description ? '<p class="exp-orig">' + esc(it.description) + '</p>' : '') +
        '</div></div></section>');
    }

    if (CV.skills && CV.skills.length) {
      out.push('<section class="cv-block cv-skills" aria-labelledby="cv-h-skills"><h4 id="cv-h-skills" class="cv-h">Skills</h4><ul class="skill-list">' +
        CV.skills.map(function (s) { return '<li class="chip chip-butter"><span class="chip-v">' + esc(s) + '</span></li>'; }).join('') + '</ul></section>');
    }

    var drawings = ['drawing-1', 'drawing-2', 'drawing-3'].map(function (d) { return slot(d, 'drawing'); }).join('');
    out.push('<section class="cv-block cv-int" aria-labelledby="cv-h-int2"><h4 id="cv-h-int2" class="cv-h">Interests</h4><ul class="hobbies">' +
      (CV.interests || []).map(function (h, i) {
        return '<li class="hobby hb-' + (i % 3) + '"><span class="hobby-ico">' + ico(h.icon) + '</span><span>' + esc(h.label) + '</span></li>';
      }).join('') + '</ul>' + (drawings ? '<div class="drawings">' + drawings + '</div>' : '') + '</section>');

    out.push('<section class="cv-block cv-contact" aria-labelledby="cv-h-contact"><h4 id="cv-h-contact" class="cv-h">Contact</h4>' +
      '<p class="contact-line">' + ico('chat') + '<span>' + esc(CV.contact) + '</span></p></section>');

    out.push('</div>');
    out.push('<footer class="cv-foot"><p class="hand">Updated ' + esc(CFG.updated) + '</p></footer>');
    out.push('</article>');
    return out.join('');
  }

  /* ---------- shopping ---------- */
  function items(list, kind) {
    return '<ol class="items">' + list.map(function (it, i) {
      return '<li class="card item item-' + kind + '" id="' + esc(it.id) + '" data-reveal>' +
        '<span class="item-ico">' + ico(it.icon) + '</span>' +
        '<div><h5 class="item-t">' + esc(it.title) + '</h5><p>' + esc(it.text) + '</p></div></li>';
    }).join('') + '</ol>';
  }

  function shopping() {
    var o = [];
    o.push('<div class="essay">');
    o.push('<h3 class="essay-title">' + esc(SHOP.title) + '</h3>');
    o.push('<blockquote class="pull" data-reveal><span class="pull-q" aria-hidden="true">&ldquo;</span><p>' + esc(SHOP.intro) + '</p></blockquote>');

    o.push('<div class="seesaw">');
    o.push('<section class="side side-good" aria-labelledby="good-h"><h4 id="good-h" class="side-head">The good side</h4>' + items(SHOP.good || [], 'good') + '</section>');
    o.push('<section class="side side-bad" aria-labelledby="bad-h"><h4 id="bad-h" class="side-head">The not so good side</h4>' + items(SHOP.bad || [], 'bad') + '</section>');
    o.push('</div>');

    var st = SHOP.story;
    if (st && st.text) {
      o.push('<aside class="card story" data-reveal data-links="' + esc(st.links || '') + '" aria-labelledby="story-h">' +
        '<span class="sticker-label story-tag" id="story-h">My experience</span>' +
        '<p>' + esc(st.text) + '</p>' +
        ((st.platform || st.when) ? '<p class="story-meta hand">' + esc([st.platform, st.when].filter(Boolean).join(', ')) + '</p>' : '') +
        '</aside>');
    }

    var hs = SHOP.habits || [];
    o.push('<section class="card habits" data-reveal aria-labelledby="habits-h">' +
      '<h4 id="habits-h" class="habits-h">' + esc(SHOP.habitsTitle) + '</h4>' +
      '<ul class="checks">' + hs.map(function (h, i) {
        return '<li><label class="check"><input type="checkbox" data-habit="' + i + '"><span class="box" aria-hidden="true">' + ico('check') + '</span><span class="check-t">' + esc(h) + '</span></label></li>';
      }).join('') + '</ul>' +
      '<p class="check-count hand" id="check-count" aria-live="polite">0 of ' + hs.length + ' ticked</p></section>');

    o.push('<p class="closing" data-reveal>' + art('cat-loaf', '0 0 150 92', '#FFF1B8', 'closing-cat') + '<span>' + esc(SHOP.closing) + '</span></p>');
    o.push('</div>');
    return o.join('');
  }

  /* ---------- journals ---------- */
  function filterLabel(key) {
    var f = FILTERS.filter(function (x) { return x.key === key; })[0];
    return f ? f.label : key;
  }

  function journals() {
    var jr = CFG.journals || {};
    var o = [];
    o.push('<p class="jr-intro">' + esc(jr.intro) + '</p>');
    o.push('<div class="filters" role="group" aria-label="Filter journals by topic">' +
      FILTERS.map(function (f, i) {
        return '<button class="fchip" type="button" data-filter="' + esc(f.key) + '" aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + esc(f.label) + '</button>';
      }).join('') + '</div>');
    o.push('<p class="sr-only" id="jr-status" role="status" aria-live="polite">Showing ' + JR.length + ' of ' + JR.length + ' journals</p>');
    o.push('<ol class="jr-list" id="jr-list">' + JR.map(function (j) {
      var tags = (j.tags || []).map(function (t) { return '<span class="tag tag-' + esc(t) + '">' + esc(filterLabel(t)) + '</span>'; }).join('');
      var ext = function (href, label) {
        return '<a class="btn btn-sm" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer"><span>' + label + '</span>' + ico('ext') + '<span class="sr-only"> (opens in a new tab)</span></a>';
      };
      return '<li class="card jr" data-id="' + esc(j.id) + '" data-tags="' + esc((j.tags || []).join(' ')) + '">' +
        '<div class="jr-tags">' + tags + '</div>' +
        '<h3 class="jr-title">' + esc(j.title) + '</h3>' +
        (j.original ? '<p class="jr-orig"><span class="tag tag-lang">Indonesian</span><span class="sr-only">Original title: </span><span lang="id" class="jr-orig-t">' + esc(j.original) + '</span></p>' : '') +
        '<p class="jr-cite">' + esc(j.authors) + ' (' + esc(j.year) + '). <em>' + esc(j.venue) + '</em>, ' + esc(j.detail) + '</p>' +
        '<div class="jr-sum"><p class="jsum" id="sum-' + esc(j.id) + '">' + esc(j.summary) + '</p>' +
        '<button class="more" type="button" aria-expanded="false" aria-controls="sum-' + esc(j.id) + '">Read more</button></div>' +
        (j.note ? '<p class="jr-extra hand">' + esc(j.note) + '</p>' : '') +
        '<div class="jr-links">' + ext(j.article, 'Article') + ext(j.pdf, 'PDF') + ext(j.doi, 'DOI') +
        '<span class="doi-text">' + esc(j.doiText) + '</span></div></li>';
    }).join('') + '</ol>');
    o.push('<p class="jr-note"><span class="jr-note-ico" aria-hidden="true">' + ico('chat') + '</span>' + esc(jr.note) + '</p>');
    return o.join('');
  }

  var parts = {
    hero: hero, portrait: function () { return slot('hero-portrait', 'portrait-slot'); },
    video: video, topper: topper, script: script, cv: cv, shopping: shopping, journals: journals
  };

  function renderAll() {
    Object.keys(parts).forEach(function (name) {
      var el = document.querySelector('[data-render="' + name + '"]');
      if (el) el.innerHTML = parts[name]();
    });
    var vt = document.getElementById('vid-title');
    if (vt && CFG.video) vt.textContent = CFG.video.title;
    var fl = document.getElementById('foot-line');
    if (fl && CFG.footer) fl.textContent = CFG.footer.line;
    document.documentElement.classList.toggle('video-empty', !videoState().has);
  }

  window.SiteRender = { renderAll: renderAll, videoState: videoState };
  renderAll();
})();
