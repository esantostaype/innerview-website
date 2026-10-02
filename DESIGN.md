# Design — InnerView marketing site

## World

Editorial ledger. Paper and ink neutrals with the isotype's blue-cyan as the only signal colour. Structure comes from hairline rules, open grids and type scale, like an import file or a ledger, not from boxes. The product is shown as an object: oversized, cropped by the viewport, tilted, layered with reconstructed UI built from real labels.

## Tokens (src/styles/global.css)

- Colour: `bg`, `raised`, `sunken`, `fg`, `muted`, `subtle`, `rule`, `rule-strong`, `primary`, `accent`, `spark-from/to`, `ink*` (inverted bands), `ready` / `review` / `blocked` (readiness states). Light and dark are tuned separately; ink bands stay dark in both themes.
- Type: IBM Plex Sans Variable only. `display` (≤6rem, 350), `h1`, `h2`, `h3`, `lead`, `body`, `small`, `label`, `caption`. Tabular numerals via `numerals`.
- Space: `gutter`, `section`; container `site` (90rem).
- Radius: 4 / 8 / 12px (frames); pills for buttons and tags only.
- Elevation: one system, `--frame-shadow` (soft shadow in light, ring and shadow in dark).
- Motion: `ease-out-expo`, reveal on enter (opacity + translate, clip for media, masked lines for headlines), Locomotive parallax speeds between -0.12 and 0.12, View Transitions fade/rise. Everything is off under `prefers-reduced-motion`.

## Rules

- No card grids, no eyebrows above headings, no gradient text, no glass, no marquees.
- Product UI is real (screenshots) or reconstructed from real labels; sample data is labelled.
- Stock photography is context only (buildings, paperwork), never product.
- Icons: Hugeicons only, through `components/ui/Icon.astro`.

## Page rhythm (home)

Hero (light, product tilted) → Problem (editorial paragraph + formats) → Origin (full-bleed photo) → Workflow (sticky reconstruction) → Control (typographic states) → AI routes (ink, diagram) → Master data (cropped screenshot + timeline) → Governance (sticky split) → Platform (ink, full-bleed screen) → Audiences → Book a demo (ink, form).
