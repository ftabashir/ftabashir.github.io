# Farzad Tabashir — Portfolio & Resume Website

The source code for my personal portfolio and professional resume website.

## Live Website

🔗 **[ftabashir.github.io](https://ftabashir.github.io/)**

---

## Features

- **Responsive Design**: Two-column grid on desktop that collapses to single-column on mobile.
- **Dark & Light Themes**: Togglable interface (persisted via `localStorage`) with glowing accents and backdrop filters.
- **Interactive Skills Filter**: Click a skill badge to highlight matching experience cards.
- **Print Optimization**: Tailored `@media print` styles for clean PDF exports via the browser print dialog.
- **Semantic HTML**: Accessible layout with `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`.
- **Zero Heavy Dependencies**: Vanilla HTML, CSS, and JavaScript — no frameworks.

---

## Project Structure

```
.
├── index.html              # Main portfolio page (fetches resume.json at runtime)
├── resume.json             # ✨ Single source of truth for all resume data
├── resume.md               # Auto-generated markdown resume
├── assets/
│   ├── icons/              # Social link SVG icons (GitHub, LinkedIn, StackOverflow)
│   └── logo/               # Company logo images
├── scripts/
│   └── generate-resume-md.js   # Generates resume.md from resume.json
├── hooks/
│   └── pre-commit          # Git hook: auto-regenerates resume.md on commit
└── README.md
```

---

## Data Architecture

All resume content lives in a single file: **`resume.json`**.

- **`index.html`** fetches `resume.json` via `fetch()` at runtime and renders all sections dynamically (profile, contact, skills, experience, education). A loading indicator shows while data loads.
- **`resume.md`** is auto-generated from `resume.json` using `scripts/generate-resume-md.js`. It should never be edited manually.

This means **you only edit `resume.json`** — both the website and the markdown resume stay in sync.

---

## Development

### Editing Resume Content

1. Edit `resume.json`
2. Regenerate the markdown:
   ```bash
   node scripts/generate-resume-md.js
   ```
3. Preview locally (see below)
4. Commit — the pre-commit hook will also regenerate `resume.md` automatically

### Local Preview

Since `index.html` uses `fetch()`, it must be served via HTTP (not opened as a `file://`):

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

### Setup After Fresh Clone

Configure Git to use the tracked hooks directory:

```bash
git config core.hooksPath hooks
```

This enables the pre-commit hook that auto-regenerates `resume.md` whenever `resume.json` is committed.
