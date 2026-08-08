# Progress log — Plaited Ponies website

Decision and work log so this project can be picked up by a new session with no
prior conversation context. Newest entries at the bottom.

---

## Current state (2026-08-08)

- **Repo:** `github.com/sjhdev/plaited-ponies.com`, hosted on GitHub Pages,
  custom domain `plaited-ponies.com` (see `CNAME`).
- **Branch `main`:** `798faaa`, identical to `origin/main`. **Untouched.** The
  live site is exactly as it was.
- **Branch `modernise-touch-up`:** ten commits ahead of `main`, pushed to
  `origin/modernise-touch-up` on 2026-08-08. **Not merged into `main`, so the
  live site is still unchanged.**
- Untracked: `CLAUDE.md`, `progress.md`. Commit them if you want them in the repo.
- Ignored: `.claude/launch.json`, added so the preview server can be started
  from the editor. Not part of the site.

To see the work: `git checkout modernise-touch-up`. To discard it entirely:
`git checkout main` and delete the branch. Nothing can reach the live site
without an explicit push.

---

## Brief

Modernise and tidy an existing static site. Explicitly **not** a redesign.
Hard constraint from the client (Shaun): **do not damage SEO.**

Agreed interpretation of that constraint — treat as untouchable unless asked:

- filenames and URL paths
- body copy, internal link targets, anchor text
- heading text and hierarchy
- `robots.txt`, `sitemap.xml`, structured data
- existing `alt` text

**Adding** missing SEO signals is in scope and encouraged. **Changing** existing
ones is not.

There is no host-level backup or rollback on GitHub Pages, so git history is the
only safety net. Work in small, separately committed steps so any single change
can be reverted alone. **Never push without asking.**

---

## The site

Five hand-written pages, no framework, no build step, no package.json.

| File | Notes |
|---|---|
| `index.html` | homepage, ~6 `<h1>` |
| `services.html` | pricing all placeholder `£*`, large commented-out lorem ipsum block |
| `values.html` | story / values |
| `team.html` | 3 people, 4 `<h1>` |
| `contact.html` | Formspree form `xkneovjn`, two Google Maps iframes |
| `index.css` | ~860 lines, the entire stylesheet |
| `index.js` | mobile menu only |
| `foot` | orphaned footer snippet, referenced by nothing |
| `README.md` | 0 bytes |

External deps, all CDN: Google Fonts (Poppins + Arizonia), a Font Awesome kit
(`kit.fontawesome.com/afc2a13d22.js`), Formspree, Google Maps embeds.

---

## Work completed

### `e9a7b54` — Bug fixes

Four genuine defects, no visual change intended:

1. **Homepage "Contact Us" button was dead.** `index.html` had
   `<a href="CONTACT US">` instead of `contact.html`. The main call to action
   404'd. Also a broken internal link, so an SEO negative.
2. **Malformed tag** in `services.html` — opened `<h3>`, closed `</h2>`.
3. **Duplicate IDs** — `id="service-btn"` on three elements in `index.html`.
   Changed to `class="service-btn"`; CSS selectors `#service-btn` and
   `#service-btn:hover` updated to match.
4. **Mobile menu.** `hideMenu()` set `display:block` while sliding the panel
   off-screen, so it stayed rendered and keyboard-focusable. Rewritten to toggle
   an `.open` class. Also closes on Escape and on nav link click. The media-query
   `.nav-links` rule now uses `transform: translateX(220px)` + `visibility:hidden`
   instead of `display:none`, with `.nav-links.open` reversing it.

### `0ce6e0f` — Images

`imgs/` was **28MB**. Now **4.2MB**, 25 files.

- **40 of 65 files were referenced by nothing.** Deleted. (Recoverable from git
  history at `798faaa` if ever needed.)
- The remaining 25 were unoptimised camera JPEGs, re-encoded **in place with
  identical filenames**, so zero HTML/CSS changes and no image URL changed.
- Referenced images 11.8MB → 4.1MB (−66%). Homepage hero `teddy.jpg`
  1015KB → 240KB. `review2.jpg` was a 2048×2048 828KB photo rendered as a 40px
  avatar → 160px, 5KB.

Sizing rules used (driven by actual display size):

| Class | Max edge | Quality |
|---|---|---|
| avatars (`review1/2.jpg`, render at 40px) | 160 | 80 |
| logo (`logot.png`) | 400 | png level 9 |
| CSS backgrounds (under a 70% black overlay) | 1600 | 70 |
| everything else | 1400 | 78 |

Verified all 25 still serve 200 before committing, and spot-checked quality
visually — no artefacts even at −83%.

### `087b6cf` — Dark mode + logo

1. **Dark-mode text was invisible.** The site declares no `background-color`, so
   a browser in dark mode painted its own dark canvas behind body text that CSS
   sets to `black`. **This is live on production right now** and affects anyone
   on a phone with dark mode enabled. Fixed with `html { color-scheme: light;
   background-color: #fff; }` at the top of `index.css`. Verified by putting the
   browser deliberately into dark mode: background renders `rgb(255,255,255)`.
   CSS only, no markup or `<head>` change. **Do not remove this rule.**
2. **Logo had 40% empty padding**, unevenly distributed (47px left, 66px right,
   6px top, 34px bottom) — that asymmetry was the visible gap. `logot.png`
   cropped from 352×337 to 243×301.
   Because that changes the aspect ratio, CSS widths were reduced so the
   *visible* mark renders at the size it always did: `nav img` 120→82px,
   `#footer-img` 150→102px, mobile `.header img` 50%→130px. Measured after:
   nav 82×102, footer 102×126, against ~81×101 and ~102×127 before.

### `b8be26b` — CSS refinement

**The first commit that visibly changes the site.** `index.css` only — no
markup, copy, headings, link targets or filenames touched, so nothing in the
SEO constraint is in play.

**Tokens.** A `:root` block replaces the magic numbers. The important part is
that the brand gold got split three ways by the background it sits on:

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--gold` | `#d4af37` | fills, borders, decoration | — |
| `--gold-ink` | `#8a6a10` | gold text on white | 5.1:1 |
| `--gold-bright` | `#e6c76b` | gold text over the photo overlays | 4.7:1 worst case |
| `--gold-deep` | `#3d2f06` | text sitting on a gold fill | 10:1 |

`#d4af37` measures **2.1:1 against white**, which fails AA at every size
including large headings, so it is no longer used for text on white anywhere.
Also `--ink` `#1f2328` for body copy (was pure black), `--rule` `#8a8a8a` for
form borders (was `#ccc`, 1.6:1, below the 3:1 non-text minimum), a fluid type
scale, a 9-step spacing scale, `--section-y`, `--measure: 68ch`, and
`--overlay` for the `rgba(4,9,30,0.7)` gradient that was repeated in nine
places.

**Three real defects surfaced while fixing contrast:**

1. The homepage "View all our services" button was white text on the gold
   fill, 2.1:1. Now dark on gold, 10:1.
2. `.other-btn:hover` set `color: white` on a transparent background, so the
   contact form's "Send Message" label **disappeared on hover** against the
   white page. Now a filled hover.
3. The mobile nav panel is gold with white link text — **2.1:1, live on
   production right now.** Now `--gold-deep`, 6.2:1, close icon included.

**Type.** Body 14px/300 → 17px/400 at 1.7 line-height. Headings use `clamp()`,
which let the mobile overrides that clamped them to 20px be deleted — the phone
hero goes 20px → 33.5px. `.team-values p i` 12px → 15px. Form inputs 16px so
iOS stops zooming on focus. Running prose capped at 68ch (Our Story went from
~180 to 69 characters per line).

**Buttons and focus.** Six selectors repeating the same eight declarations now
share one base rule: `inline-flex`, 44px minimum touch target, 8px corners to
match the cards. The `transition` moved out of `:hover`, where it only animated
on the way in and snapped back on the way out. Added one `:focus-visible` rule
(gold ring, dark halo, works on white and on photography) — **there was no
focus state anywhere on the site**, and `.contact-col input` set
`outline: none`, which stripped the ring off the contact form entirely.

**Also:** `box-sizing: border-box` globally (needed, since sections now carry
inline padding); `margin-bottom: -30px` on `.team-values` and `margin-top:
100px` on `.locations` replaced with real spacing; `cursor: pointer` dropped
from `.reviews-col`, which is not clickable; `word-spacing: 30px` dropped from
nav items, where every label is one word; the mobile-only `background-color:
navy` on the contact button dropped, since it made that one button inconsistent
with every other page; a hairline separator added to the `.services-right`
price rows; the three identical `#angela-col`/`#gracie-col`/`#ellie-col` rules
merged.

**Verification.** A script walked every text-bearing element on all five pages,
resolved the effective backdrop, and assumed the *worst case* photo (pure white
under the 70% overlay, `rgb(79,83,98)`), applying 4.5:1 for normal text and
3:1 for large. **Zero failures on all five pages.** No horizontal overflow at
1366px or 375px. Mobile menu 6.21:1, tap targets 184×55. Form border 3.45:1,
placeholder 5.33:1. Logo geometry unchanged from `087b6cf` (header 130×161,
footer 102×126 on mobile).

Screenshots were not available in that session — the browser pane was not
compositing — so the automated checks are computed-style based. Visual sign-off
was Shaun's, in his own browser.

### `61c2976` — Contact CTAs jump to the form

`contact.html` leads with the page header and two Google Maps embeds, so
clicking a contact button landed a visitor ~2000px above the form.

Added `id="enquiry"` to the `.contact-us` section (address, phone, email and
the Formspree form) and pointed the call-to-action buttons at it. Only a
fragment is added, so no URL path changed and no existing link target moved.
`scroll-margin-top: var(--space-7)` keeps it off the top of the viewport.

Left pointing at the top of the page, deliberately — they are navigation
rather than conversion, and the maps are the point of the page for someone
browsing: the nav `Contact` link, the footer `CONTACT` link, and the two
location cards on the homepage.

### `e93ac3d` — Mobile logo down to 80px

Was 130px, rendering 130×161 in a phone header. Now 80×99.

**The image has no croppable padding left, and this was measured, not
assumed.** The ink bounding box sits 2px from every edge; only 3% of the
canvas is unused; there are no blank horizontal bands. The 54% of the file
that is transparent is the area around a non-rectangular illustration.

### `24575bd` — Homepage hero CTA

`<a class="hero-btn" href="values.html">Our Values</a>` became
`<a class="hero-btn" href="contact.html#enquiry">Contact Us</a>`.

This changes existing anchor text *and* an internal link target, which the
standing SEO rule protects. It was an explicit instruction from Shaun, not a
judgement call — recorded here so nobody "fixes" it back. `values.html` keeps
three inbound links from the homepage (nav, footer, and the Story card), so it
is not orphaned.

### `d1c5698` — Logo highlights warmed

Shaun flagged what looked like white gaps in the mane and crown. They are
neither white nor transparent: the file contains only **21** near-white
pixels, and those are pale-gold speculars. What he circled were the highlight
bands of the faux-metallic gradient, which ran from `rgb(138,123,31)` to
`rgb(255,252,205)` — a top end that is effectively white, so against the dark
photo header those bands read as holes punched through the mark.

Pixels above luminance 168 are now blended toward `rgb(238,208,124)` in
proportion to their brightness. Mid-tones and shadows untouched, so the
metallic sheen survives; the peaks are gold rather than white.

| | before | after |
|---|---|---|
| brightest opaque pixel | `rgb(255,252,205)` | `rgb(244,216,168)` |
| p95 luminance | 218 | 213 |

21% of the canvas altered. Geometry, dimensions, alpha channel, filename and
file size all effectively unchanged (41KB). No markup or CSS change.

### `205d866` — Hero divider

A 72×3px gold bar on `.text-box h1::after`, sitting 24px below the hero title
and 24px above its subtitle. Echoes the gold underline already used on the nav
links, so it reads as part of the system rather than new decoration.

CSS only. All five heroes have a title followed by a one-line subtitle, so it
applies site-wide, not just the homepage.

---

## Deployment — how the live site actually updates

Verified 2026-08-08, because it matters and guessing is expensive:

- GitHub Pages deploys from **`main` at root**. `main` is the only remote
  branch, there is no `.github/workflows` and no `gh-pages`.
- Confirmed empirically: `https://plaited-ponies.com/index.css` served the
  pre-refinement stylesheet (starts `*{`, no `--gold-ink`) while `main` sat at
  `798faaa`.
- **Committing changes nothing.** **Pushing `modernise-touch-up` changes
  nothing on the live site** — it only creates a remote branch.
- Only `git merge` into `main` followed by `git push origin main` publishes.
  Takes about a minute to go live.
- **Decision, 2026-08-08:** Shaun chose *not* to publish yet. Step 4 gets
  finished first so the visual work and the SEO head additions ship together.
  Accepted cost: the dark-mode invisible text and the white-on-gold mobile menu
  stay live in the meantime.
- `CNAME` is at the repo root and must stay there or the custom domain breaks.
- `gh` CLI is **not installed** on this machine, so the Pages settings cannot
  be read via the API. The above was established from the repo and the live
  response.

### `9230b0f`, `1354d57`, `056c7f9` — Step 4, head additions

**Step 4 is done.** Titles were confirmed with Shaun before touching them.

`9230b0f` — icons and social image, all generated from assets already in the
repo: `favicon.ico` (32px PNG in an ICO container so `/favicon.ico` stops
404ing), `favicon-32.png`, `apple-touch-icon.png` (180px on a solid `#04091e`
tile, since iOS handles transparency poorly and the gold needs dark backing),
and `imgs/og-image.jpg` (1200×630 centre crop of `teddy.jpg`, the correct
1.91:1 for social cards). The 192/512 PWA icons were dropped — nothing requests
them without a manifest and the 512 was 235KB.

`1354d57` — the substance:

| Page | Title (all < 60 chars) |
|---|---|
| `/` | Pony Parties & Riding Lessons, Falkirk \| Plaited Ponies |
| `/services.html` | Our Services: Parties, Lessons & Livery \| Plaited Ponies |
| `/values.html` | Our Story & Values \| Plaited Ponies Equine Services |
| `/team.html` | Meet the Family \| Plaited Ponies Equine Services |
| `/contact.html` | Contact & Locations \| Plaited Ponies, Avonbridge |

Plus per-page meta descriptions (142–154 chars), self-referencing canonicals,
favicon links, `theme-color`, full Open Graph and `twitter:card`. The unicorn
emoji was dropped from titles — Google strips emoji from results anyway.

`LocalBusiness` JSON-LD on the homepage only, built strictly from details
already published on the site. **Two deliberate omissions:** no
`aggregateRating`/`review` (Google disallows self-serving review markup on
`LocalBusiness` — it cannot produce rich results and risks a manual action),
and no `priceRange` (services still show placeholder `£*`). **Only one address
is marked up** — The Crofts at Armadale has no street address published
anywhere on the site. If Shaun supplies it, add a second entry.

Alt text on the nine content images that had `alt=""`. **Every image was opened
and described from what is actually in it**, not guessed from the filename.
`loading="lazy"` added to the same nine, none of which are above the fold. The
two review avatars keep `alt=""` deliberately — they sit beside the reviewer's
name, so describing them would make a screen reader say the person twice.

`056c7f9` — `sitemap.xml` (five URLs with `lastmod`) and `robots.txt`.

Verified: five unique titles, five unique descriptions, JSON-LD parses, every
sitemap URL returns 200, all icons serve with correct content types, no console
errors, no contrast regressions, no broken images.

### `bd13851`, `c409934` — Step 6, dead code

**The agreed six-step plan is now complete.**

Deleted `foot` (duplicate footer snippet, referenced by nothing), `imgs/grass.jpg`
(only reachable from a commented-out block) and `imgs/try24.jpg` (only reachable
from `#about-us-header`, a rule no page uses — `values.html` uses
`#values-header`).

Removed the commented lorem ipsum block in `services.html` **and the stray
`</div>` it left behind** — that closing tag was unmatched, so the services page
had broken nesting. All five pages now balance divs exactly. Also removed the
commented `<script>` blocks in three pages, 11 spacer paragraphs (`<p>*</p>`
rendered a literal asterisk on the page), and the `X-UA-Compatible` meta.

From `index.css`: the `hr`/`#hr-review` rules (no `<hr>` exists), `.services-left h2`
(matches nothing — `services.html` uses `h3` there), `#about-us-header`, and the
`font-family: 'Arizonia', cursive` line that was overridden on the very next row.

**`README.md` was left alone** — progress.md recorded it as 0 bytes but it holds
the repo title heading, so it is not dead. The footer's asterisk was also left:
it sits inside a copy block as a separator, not as a spacer.

### `b6f0df1`, `cc080f4`, `1b7305b` — Low-risk modernisation

Recommendations from the 2026-08-08 review, the subset that carries no SEO risk.

**Semantic landmarks.** Every page was a flat run of `<section>` with no
`<main>`, `<header>` or `<footer>`. Now `body > header, main, footer, script` on
all five. Footer link row became `<nav aria-label="Footer">`, header nav got
`aria-label="Main"`. Class names untouched, so no visual change.

> **Gotcha this exposed.** The bare `nav{}` rule (flex, space-between, padding)
> was written for the header, and the moment the footer link row became a
> `<nav>` it started matching that too. Both `nav{}` rules are now scoped to
> `.header nav`. **`nav img` and `nav .fa` were deliberately left unscoped** —
> the footer nav contains neither, and tightening `nav .fa` to `.header nav .fa`
> would outrank `.nav-links .fa` and reinstate the white-on-gold mobile close
> icon fixed in `b8be26b`.

**One `<h1>` per page.** Homepage had six, `team.html` four, `values.html` three.
Only the tag changed — every heading keeps its exact text and appearance, with
`h2` grouped into the `h1` sizing rule so section headings still render 44px/600
in the same golds. Seven CSS selectors remapped to match.

**Core Web Vitals.** All 21 `<img>` tags got true intrinsic `width`/`height`
(verified against `naturalWidth`/`naturalHeight`, zero mismatches) to stop layout
shift. Google Fonts trimmed from seven Poppins weights plus Arizonia to
`400;500;600` — the only three the stylesheet uses. Each page hero is a CSS
`background-image` the preload scanner cannot find, so each page got a
`<link rel="preload" as="image" fetchpriority="high">` for its own hero.

---

## Verified facts — do not re-litigate

- **The Font Awesome icons work.** The kit has the v4 compatibility shim
  enabled, so the old `fa fa-facebook` syntax resolves to real FA6 glyphs
  (checked in-browser: `U+F39E` facebook, `U+F16D` instagram, `U+F005` star).
  They look broken in the source. They are not. Do not "fix" them.
- **`sharp` holds the input file open on Windows.** Overwriting an image in
  place fails with `UNKNOWN: open`. Read the file into a Buffer first and pass
  the Buffer to `sharp()`, and set `sharp.cache(false)`.
- **`grass.jpg` is only referenced inside a commented-out block** in
  `services.html`. It survived the orphan purge deliberately. If step 6 removes
  that comment, delete the image too.
- **`logot.png` has no whitespace left to crop.** Measured twice, once in
  `087b6cf` and again in `e93ac3d`: ink bounding box 2px from every edge, 3% of
  the canvas unused, no blank bands. If the logo still feels too big, the lever
  is CSS width, not the image. The remaining "empty" look is the mark's own
  negative space — the gaps between crown points and the open centre of the
  roundel — and removing that means redrawing the logo.
- **The `git` blobs use CRLF** even though `core.autocrlf` is `true`. Write
  `index.css` with CRLF or the whole file shows as rewritten and the commit
  stops being reviewable. Convert before staging.
- **Commit messages must go through `git commit -F <file>`.** PowerShell
  here-strings get flattened by the tool harness and git then reads the message
  body as pathspecs.

---

## Known issues, not yet addressed

**SEO gaps** (all additive, none are changes to existing signals):

- All five pages share the identical `<title>`: `🦄 Plaited Ponies`. Google
  cannot distinguish them. This is the single biggest SEO problem on the site.
- No meta descriptions on any page.
- No Open Graph / Twitter card tags. The site links heavily to Facebook and
  Instagram, so shares render bare.
- No canonical tags, no favicon, no `sitemap.xml`, no `robots.txt`.
- No structured data. `LocalBusiness` schema is a strong fit — two addresses,
  phone number, opening hours, real reviews.
- Nearly every content `<img>` has `alt=""`.
- Multiple `<h1>` per page (homepage ~6, `team.html` 4).

**Visual / CSS** (type, spacing, buttons, focus and contrast all done in
`b8be26b` — what is left needs markup changes, so it was out of scope):

- Long prose is still `text-align: center` in `.about-col p` and
  `.family-col p`. Capping the measure at 68ch helped, but centred running text
  is inherently harder to read. Changing alignment exceeded the agreed "keep the
  existing layout" scope — raise it with Shaun separately.
- `<p>*</p>` used as a spacer in ~8 places; several empty `<p></p>`. These
  render as literal asterisks on the page.
- The mobile menu toggle is an `<i onclick>`, not focusable by keyboard. Should
  become a `<button>` — touches nav markup in all 5 files. The `:focus-visible`
  rule is now in place and will apply the moment it becomes a real control.
- Footer markup is duplicated inline across all 5 pages.

**Dead code:**

- `foot` (orphan), `README.md` (empty), commented-out `<script>` blocks in
  `services.html`/`team.html`/`values.html`, commented lorem ipsum in
  `services.html`, CSS for `hr` and `#hr-review` when no `<hr>` exists anywhere.

---

## Next steps

**All six agreed steps are done**, plus the low-risk half of the modernisation
review. The branch is pushed but not merged, so the live site is still untouched.

Still outstanding, in rough order of value:

1. **Real pricing on `services.html`.** Every price is a placeholder `£*` on the
   one page meant to convert. This is worth more than everything below combined —
   "pony party prices Falkirk" is exactly what people search.
2. **Claim and populate the Google Business Profile.** For a local business this
   outranks anything on the site itself.
3. **Left-align the long prose** in `.about-col p` and `.family-col p`. Capping
   the measure at 68ch helped; centred running text is still the harder read.
   Deferred because it exceeds "keep the existing layout".
4. **A page per service** (`/pony-parties.html`, `/livery.html`). Adding URLs is
   SEO-safe; changing existing ones is not.
5. **Replace the Font Awesome kit with inline SVG.** A render-blocking script
   from two hosts for six icons. Needs care — the icons work via the v4 shim.
6. **Click-to-load the two Google Maps embeds** on `contact.html`.
7. **Make the mobile menu toggle a `<button>`.** It is an `<i onclick>` and is
   not keyboard reachable. The `:focus-visible` rule is already in place and will
   apply the moment it becomes a real control. Touches nav markup in all 5 files.
8. **De-duplicate the footer**, currently inline in all five pages.

Heading hierarchy was explicitly deferred: multiple `<h1>` is untidy but Google
handles it fine in HTML5, so it is the lowest payoff for the most markup churn.

---

## Open question — should this become a one-page site?

Shaun asked (2026-08-08). Advice given was **no, not now**. Reasoning, so it
does not have to be rebuilt from scratch if it comes up again:

**Against.** Five URLs that can rank independently collapse to one. Each page
can carry its own title, meta description and H1 targeting a different query —
"pony parties Falkirk", "livery Armadale", "riding lessons Avonbridge". One
page gets one of each. For a business with two locations and four services,
that is real reach given up.

**The migration is the sharp edge, not the destination.** The four sub-pages
are indexed under URLs that would stop existing, and **GitHub Pages cannot
issue 301 redirects** — there is no server-side config. The options are
`jekyll-redirect-from`, which generates meta-refresh HTML that Google follows
but weights lower, or letting them 404 and throwing the signal away. This
constraint is specific to the hosting and is the main reason to hold off.

**For.** Simpler to maintain, internal link equity concentrated on one URL,
and a scroll-through suits a small local business. The current pages are thin —
`services.html` still shows placeholder `£*` pricing.

**Recommended instead.** Do step 4 first. All five pages sharing the title
`🦄 Plaited Ponies` is the biggest SEO problem on the site and the cheapest to
fix. If the one-page *feel* is what is wanted, make the homepage a richer
anchor-scroll (the `#enquiry` pattern from `61c2976`) while keeping the five
pages live and indexed.

**Unknown.** Whether the sub-pages actually earn search traffic. Google Search
Console would settle it — if `services.html` and `values.html` bring in
nothing, the calculus shifts. Worth checking before deciding either way.

---

## Previewing locally

No dev server in the repo, and no `package.json`. Any static server works:

    npx --yes serve .

Do not open the HTML with `file://` — the Google Maps iframes and the Formspree
form behave differently off `http://`.

---

## Session note

The first session was launched from a different project's folder, so its
temp paths and loaded `CLAUDE.md` referenced an unrelated project. No files from
either project ever crossed over — all work is confined to this folder. Start
future sessions with this folder as the root.
