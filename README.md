# Madhu Dath — vj-madhu-dath.github.io

A small personal hub for web apps, drawn as floating bubbles.

Four apps are listed here right now:

- **Flute Timer** — https://vj-madhu-dath.github.io/flute-timer/
- **Camera Butler** — https://vj-madhu-dath.github.io/camera-butler/
- **DoneDoner** — https://donedoner.web.app/
- **Deadline Calendar** — https://vj-madhu-dath.github.io/deadline-calendar/

All bubbles are the same size at rest. Hovering one crowns it: it grows, the others recede, and the bubble reveals a short description and meta line. Clicking opens the app in a new tab. On phones, the first tap previews and the second opens.

## Files

```text
.
├── index.html
├── apps.js          Reads the static app cards for enhancement
├── app.js           Bubble layout and interactions
├── styles.css
├── assets/
│   └── favicon.svg
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── README.md
```

No build step, no dependencies, no external fonts. Plain HTML, CSS and JavaScript.
The app cards and their FAQs are present in `index.html` for crawlability; JavaScript
enhances that markup with the scattered bubble layout and interactions.

## Preview locally

```bash
python3 -m http.server 8899
```

Then open <http://127.0.0.1:8899/>.

## Adding another app

Add an `<article data-app-card>` to `index.html` with the app bubble and its FAQ
disclosures. Keep its heading, description, link, and FAQ answers in the HTML. Then
add the app to the JSON-LD item list and `sitemap.xml`. `apps.js` discovers app cards
from the page automatically.

The bubble layout and behavior remain automatic:

- Bubbles stay equal in size and shrink as the collection grows.
- Placement is randomized on every reload, with a minimum gap and enough edge space for the hover expansion.
- Kickers should follow the app order and tint is set on each card.
- Each bubble gets its own drift timing.

The layout is seeded once per page load, so it stays put while you resize. Refreshing gives a new arrangement. With more than about ten apps the bubbles get quite small; beyond that, consider splitting into separate pages.

## Behavior notes

- **Desktop:** hover (or keyboard focus) crowns a bubble. Click opens it.
- **FAQs:** the crowned app reveals five small FAQ bubbles. Open a question to read its answer.
- **Touch:** first tap previews, second tap opens. FAQ bubbles open answers; tapping the background or pressing Escape clears the preview.
- **Keyboard:** focus reveals the description; Enter opens the app on the first activation.
- **Reduced motion:** drift and transitions are disabled.

## Deploy

The repo must be named `vj-madhu-dath.github.io` and be public. Publish from the `main` branch at the repo root (Settings → Pages). Every push to `main` republishes the site.
