# Project rules: Shevie's portfolio

Static site: plain HTML, CSS, and JavaScript. No framework, no build step, no runtime npm. Open `index.html` directly or serve it with any static server. Hosted on GitHub Pages, possibly under a sub-path, so use only relative paths (no leading slash).

## Copy
- All site text is English: advanced but relaxed and polite, written like a real student, not like an AI.
- No em or en dashes in prose, no "not X but Y" contrasts, no stacked triads, no sales language. Short, natural sentences.
- Never invent facts. Anything marked [CONFIRM] in `_inbox/CONTENT_Shevie.md` stays off the public page.
- Never publish phone, email, address, date of birth, religion, NIM, or family details.
- Cats are decoration. Never write that Shevie owns or loves cats.

## Assets
- Self-host everything. Fonts and GSAP were downloaded once from npm into a temporary folder, copied into `fonts/` and `js/vendor/`, and committed. No CDN links.
- All paths relative, no leading slash.

## Quality floor
- Responsive from 360 to 1920px, no horizontal scroll.
- WCAG AA contrast. Pastels are for backgrounds and decoration only, never for text.
- Visible focus states, full keyboard operability, correct aria on toggles, filters, and accordions.
- `prefers-reduced-motion` support. If motion code fails, every section stays visible and usable.
- No console errors, good Lighthouse scores.
- Animate only transform, opacity, clip-path, and CSS custom properties.

## Data
- Text lives in `data/*.js` (`config.js`, `cv.js`, `shopping.js`, `journals.js`, `photos.js`) so Shevie can edit it without touching markup.
- `js/render.js` renders from the data. The important content (hero, CV, essay, journal list) is also shipped as static HTML inside `index.html` (between `<!-- prerender:NAME -->` markers) so it reads without JavaScript. After editing data, run `python tools/prerender.py` to refresh that static copy.
- Internship, skills, and the skincare story render only when their data is filled. No "coming soon" boxes.

## Layout of the code
- `css/style.css` tokens, base, components. `css/sections.css` per-section styles.
- `js/render.js` data to DOM. `js/app.js` behaviour (nav, video facade, accordions, filters, checklist, photo slots, lightbox, theme). `js/motion.js` GSAP and ScrollTrigger only.
