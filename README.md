# Madhu Dath — vj-madhu-dath.github.io

A small personal hub for web apps, drawn as floating bubbles.

Two apps live here right now:

- **Flute Timer** — https://vj-madhu-dath.github.io/flute-timer/
- **Camera Butler** — https://vj-madhu-dath.github.io/camera-butler/

All bubbles are the same size at rest. Hovering one crowns it: it grows, the others recede, and the bubble reveals a short description and meta line. Clicking opens the app in a new tab. On phones, the first tap previews and the second opens.

## Files

```text
.
├── index.html
├── apps.js          The app list — edit this
├── app.js           Rendering, layout and interactions
├── styles.css
├── assets/
│   └── favicon.svg
├── .nojekyll
└── README.md
```

No build step, no dependencies, no external fonts. Plain HTML, CSS and JavaScript.

## Preview locally

```bash
python3 -m http.server 8899
```

Then open <http://127.0.0.1:8899/>.

## Adding another app

Open `apps.js` and add one object to the array:

```js
{
  name: "Your App",
  category: "Utilities",
  tagline: "One short line shown at rest.",
  blurb: "A sentence or two revealed when the bubble is crowned.",
  meta: "2026 · Browser · No account",
  href: "https://vj-madhu-dath.github.io/your-app/",
  tint: [174, 188, 255], // optional [r, g, b]
}
```

That's it. Everything else is automatic:

- Bubbles stay equal in size and shrink as the collection grows.
- Placement is randomized on every reload, with a minimum gap and enough edge space for the hover expansion.
- Kickers renumber automatically.
- Missing tints are picked from a small palette.
- Each bubble gets its own drift timing.

The layout is seeded once per page load, so it stays put while you resize. Refreshing gives a new arrangement. With more than about ten apps the bubbles get quite small; beyond that, consider splitting into separate pages.

## Behavior notes

- **Desktop:** hover (or keyboard focus) crowns a bubble. Click opens it.
- **Touch:** first tap previews, second tap opens. Tapping the background or pressing Escape clears the preview.
- **Keyboard:** focus reveals the description; Enter opens the app on the first activation.
- **Reduced motion:** drift and transitions are disabled.

## Deploy

The repo must be named `vj-madhu-dath.github.io` and be public. Publish from the `main` branch at the repo root (Settings → Pages). Every push to `main` republishes the site.
