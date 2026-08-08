# Plaited Ponies website

Static site for Plaited Ponies Equine Services, hosted on GitHub Pages at
**plaited-ponies.com** (see `CNAME`). Repo: `github.com/sjhdev/plaited-ponies.com`.

This project has **no connection to any other project** in the parent folder.

## Structure

Five hand-written pages, no framework and no build step. Edit the files directly.

- `index.html`, `services.html`, `values.html`, `team.html`, `contact.html`
- `index.css` — the entire stylesheet
- `index.js` — mobile menu toggle only
- `imgs/` — all images
- `foot` — an orphaned footer snippet, not referenced by any page

External dependencies, all CDN: Google Fonts (Poppins, Arizonia), a Font
Awesome kit, a Formspree endpoint on the contact form, two Google Maps iframes.

## Standing rules

**Protect SEO.** Treat as untouchable unless explicitly asked:

- filenames and URL paths (no renaming `about.html`)
- body copy, internal link targets, anchor text
- heading text and hierarchy
- `robots.txt`, `sitemap.xml`, structured data
- existing `alt` text

Adding what is currently missing is fine and encouraged. Changing what is
already there is not.

**There is no host-level backup.** Git history is the only rollback. Work on a
branch, commit in small labelled steps so any single change can be reverted on
its own, and never push without asking first.

**British English.**

## Gotchas found the hard way

- `sharp` holds the input file open on Windows. Read the file into a Buffer
  first if overwriting an image in place, or the write fails with `UNKNOWN`.
- The Font Awesome kit's v4 compatibility shim is enabled, so the old
  `fa fa-facebook` syntax resolves to real FA6 glyphs. The icons work. Do not
  "fix" them.
- The site declares no `background-color`, so a dark-mode browser used to paint
  a dark canvas behind black body text. `html { color-scheme: light }` in
  `index.css` pins this. Do not remove it.

## Work done so far (branch `modernise-touch-up`, not yet pushed)

1. **Bug fixes** — homepage "Contact Us" button pointed at `href="CONTACT US"`
   and 404'd; `<h3>`/`</h2>` mismatch in `services.html`; three elements shared
   `id="service-btn"`; mobile menu left the panel focusable off-screen.
2. **Images** — `imgs/` was 28MB. Removed 40 unreferenced files, re-encoded the
   remaining 25 in place keeping filenames identical so no markup changed.
   Now 4.2MB. Homepage hero 1015KB to 240KB.
3. **Dark mode and logo** — pinned light colour scheme; cropped 40% empty
   padding from `logot.png` and reduced the CSS widths so the visible logo
   renders at its previous size.

## Planned next

4. **Head additions** (not started) — unique `<title>` per page (all five are
   currently the identical "🦄 Plaited Ponies"), meta descriptions, Open Graph
   tags, favicon, alt text, `LocalBusiness` structured data, sitemap.
5. **CSS refinement** (not started) — this is the only step that changes how the
   site *looks*. Body text is 14px, everything is centre-aligned, gold `#d4af37`
   fails contrast in places, spacing is magic numbers.
6. **Dead code cleanup** (not started) — the `foot` file, empty `README.md`,
   commented-out lorem ipsum in `services.html`, CSS for `<hr>` elements that do
   not exist, `<p>*</p>` spacers.

## Previewing locally

No dev server in the repo. Any static server works, e.g.:

    npx --yes serve .
