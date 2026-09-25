# Khatib Laboratory Website

Static website for the Khatib Laboratory at Virginia Tech. It is intentionally built with plain HTML, CSS, and JavaScript so future lab members can maintain it without a framework or build system.

## Files

- `index.html` — homepage, research highlights, publication preview, news, contact CTA
- `research.html` — research areas, projects, techniques, collaborators
- `team.html` — PI, current members, undergraduates, alumni
- `publications.html` — complete publication list and topic filters
- `style.css` — shared visual styles used site-wide
- `site.js` — shared navigation/accessibility behavior and publication auto-sync logic
- `images/` — group and member photographs

## Common updates

### Add a publication

1. Open `publications.html`.
2. Add a new `.pub-item` at the top of the appropriate year group (or create a new year group).
3. Do **not** manually renumber every publication. `site.js` calculates publication numbering and the total automatically when the page loads.
4. The homepage publication count and recent-publications preview automatically synchronize from `publications.html` when the site is hosted over HTTP/HTTPS.

When opening `index.html` directly from a computer with a `file://` URL, browsers may block the cross-file sync. The embedded homepage preview remains as a fallback. Use a local web server for a true preview (see below).

### Add or update a team member

Edit `team.html`. Existing cards can be copied as templates. Member photos belong in `images/` and should use lowercase, hyphenated filenames, for example `images/jane-doe.jpg`.

### Replace the group photo

Replace `images/group-photo.jpg` with the new image. For fast loading, keep it reasonably compressed (roughly 500 KB–1 MB if possible) and use the same filename.

### Update news or funding

News is currently maintained in `index.html`. Funded projects and collaborators are maintained in `research.html`.

### Change colors, typography, or shared layout

Edit `style.css`. Design tokens are defined near the top under `:root`.

## Local preview

Do not rely only on double-clicking `index.html`, because the homepage publication synchronization uses `fetch()` and many browsers restrict that on `file://` pages.

From this folder, run one of these commands:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser.

## Before publishing a change

- Check desktop and mobile layouts.
- Click the main navigation links.
- Check external links and email links.
- Confirm new images load and have useful `alt` text.
- Confirm the Publications page filter buttons still work.
- Confirm the homepage publication count/preview matches `publications.html`.

## Ownership / continuity recommendation

Keep this repository in a lab-owned GitHub Organization rather than a student's personal account. Give the PI and at least one additional long-term lab member organization ownership/admin access, and give active maintainers repository write access.

## Virginia Tech color palette

The site uses Virginia Tech's primary brand palette:
- Chicago Maroon: `#861F41`
- Burnt Orange: `#E87722`
- Impact Orange for accessible digital text: `#C64600`
- Hokie Stone: `#75787B`
- Yardline White: `#FFFFFF`

The shared palette is defined near the top of `style.css`. The existing semantic variable names
(`--gold`, `--rust`, and `--teal`) are intentionally retained as aliases so older page-specific
styles continue to work while using the VT palette.
