---
name: blog-cover-image
description: Generate a 1600x900 cover image for a blog post in this repo, matching the existing title-card style (dark canvas, faint syntax-highlighted code, an Anton condensed-uppercase title with a cyan/magenta chromatic-aberration glitch, the Angular gradient shield, and the @enea_jahollari handle). Use whenever a new post needs its `coverImage`, or when refreshing an existing one.
---

# Blog cover image

Produces the title-card cover used by every post in `src/content`. Output goes to
`src/assets/<slug>.png`, which is served at `/<slug>.png` because `vite.config.ts`
sets `publicDir: 'src/assets'` — so the post frontmatter references
`coverImage: "/<slug>.png"`.

## The house style (what these covers look like)

- **1600×900**, near-black background (`#0d0d0f`).
- **Faint code** relevant to the post, filling the canvas at ~15% opacity with a
  slight blur and subtle syntax colors. Use a snippet from the post itself.
- **Title**: heavy condensed uppercase [Anton](https://fonts.google.com/specimen/Anton)
  font, white, with a **chromatic-aberration glitch** — a cyan copy offset left, a
  red/magenta copy offset right. One array entry per rendered line.
- **Angular gradient shield** centered below the title (purple → pink → red).
- **`@enea_jahollari`** handle under the logo.
- A topical **emoji** at the end of the title is optional — some covers use one
  (🎁 🎨 ⚡), some don't. Leave `emoji` empty for none.

The bundled `fonts/Anton.ttf` (SIL Open Font License) is embedded into the render,
so no network access is needed.

## How to generate one

1. Write a config JSON (see `examples/chaining-resources-in-angular.json`):

   ```json
   {
     "title": ["FIRST LINE", "SECOND LINE"],
     "emoji": "",
     "handle": "@enea_jahollari",
     "output": "src/assets/<slug>.png",
     "codeOpacity": 0.15,
     "code": "const x = ...;\n// a snippet from the post"
   }
   ```

   - `title` — control the wrapping yourself; give one string per line. Keep each
     line short enough to fit ~1400px at the default 118px size (roughly ≤ 20 chars
     for a two-line title). Drop `titleSize` to e.g. `96` for longer lines.
   - `code` — raw TS/JS/HTML. `<`, `>`, `&`, template literals, and `${...}` are
     handled; keywords, strings, comments, and `fn(` calls get faint colors.
   - `emoji` — omit or set `""` for no emoji.

2. Run it from the **repo root**:

   ```bash
   node .claude/skills/blog-cover-image/generate.cjs path/to/config.json
   ```

   (It's a `.cjs` file because the repo's `package.json` sets `"type": "module"`.)

   (Save configs anywhere — a scratch dir is fine; they don't need to be committed.
   The `examples/` one is kept as a reference.)

3. Open the PNG and eyeball it against a recent cover (e.g.
   `src/assets/providing-inputs-in-di.png`). Check the title fits on its lines and
   the code isn't so bright it competes with the title. Then wire it into the post's
   frontmatter as `coverImage: "/<slug>.png"`.

## Requirements

- **Google Chrome** (headless) installed. The script auto-detects the macOS path;
  override with `CHROME_BIN=/path/to/chrome` if needed. Chrome renders the HTML to
  an exact 1600×900 PNG.
- Node (already present — this is an Angular project).

## Tuning knobs (config fields)

| field         | default            | notes                                            |
| ------------- | ------------------ | ------------------------------------------------ |
| `title`       | —                  | array of lines (required)                        |
| `code`        | —                  | faint background snippet (required)              |
| `output`      | —                  | e.g. `src/assets/<slug>.png` (required)          |
| `emoji`       | none               | topical emoji appended to the last title line    |
| `handle`      | `@enea_jahollari`  | text under the logo                              |
| `codeOpacity` | `0.15`             | lower it (≈0.10) if the code feels too loud      |
| `titleSize`   | `118`              | px; lower for longer titles                      |
