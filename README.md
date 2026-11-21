# metin.lab

Personal research site: reading notes, tools, a game and a tiny shell, built around olfaction, neural signals and neural interfaces.
Built with [Astro](https://astro.build): static HTML, no framework runtime, and vanilla JS only where something moves.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
```

Requires Node 22 or newer.

## Nerd features

| Feature | Where | Notes |
|---|---|---|
| Knowledge graph | `/graph` | Notes ↔ topics, concepts, authors. Add `concepts: [...]` to a note's frontmatter to wire it in. `?focus=decoding` highlights a node. |
| Reading heatmap | `/notes`, `/now` | Built from each note's `date`. Write regularly to keep the streak. |
| Spike sonification | LIF neuron → **Listen** | Every simulated spike is a click (Web Audio). |
| Spike Sorter | Home → Play | 20 waveforms, 3 units, then your labels in feature space. Keys `1 2 3`. |
| Odor Decoder | Home → Play | Best score saved in localStorage. |
| Command palette | `⌘K` / `Ctrl K` | Fuzzy jump to pages, notes and actions. |
| Shortcuts | `?` | `g h/n/g/w/t/p/s` go-to, `j/k` move through notes, `r` random note, `m` sound. |
| Konami code | `↑↑↓↓←→←→ B A` | Fires an action potential across the page. |
| BibTeX | every note, terminal `bibtex <slug>` | Generated from frontmatter. |
| `/now` + lab log | `src/data/now.json`, `src/data/log.json` | Log also shows in the terminal via `git log`. |
| Terminal | Home → shell | `help`, `ls notes`, `open`, `bibtex`, `git log`, `fire`, `sound`, `neofetch`, hidden extras. |

Add a terminal command in `src/components/Terminal.astro` (`run()`), and a palette entry in `src/components/CommandPalette.astro` (`items`).

## Where things live

```
src/
  content/notes/*.md       ← reading notes (one Markdown file per paper)
  data/publications.json   ← papers, patents, preprints, talks
  data/now.json            ← /now page sections
  data/log.json            ← lab log (newest first)
  lib/notes.ts             ← BibTeX, graph builder, helpers
  lib/audio.ts             ← spike clicks (Web Audio)
  content.config.ts        ← schema for notes & publications (tags live here)
  pages/
    index.astro            ← home: hero, notes, tools, games, terminal, pubs, about
    graph.astro            ← knowledge graph
    now.astro              ← now page + git-style lab log
    notes/index.astro      ← all notes, filterable
    notes/[...slug].astro  ← single note page
    rss.xml.js             ← RSS feed at /rss.xml
    404.astro              ← "This neuron went silent."
  components/
    Hero.astro             ← live synthetic LFP, respiration, raster, typed line
    LifSimulator.astro     ← leaky integrate-and-fire neuron
    OdorDecoder.astro      ← the game (best score saved in localStorage)
    Terminal.astro         ← the shell; add commands in run()
    NoteGrid.astro, Nav.astro, StatusLine.astro
  styles/global.css        ← design tokens (colors, fonts, spacing)
```

## Write a new note

Create `src/content/notes/my-paper-2026.md`:

```md
---
title: Your headline
paper: "The paper's real title"
authors: First Author et al.
venue: Journal
year: 2026
tag: Olfaction            # Olfaction | Signal processing | Machine learning | BCI
minutes: 5
concepts: [decoding, EEG]  # optional, links notes in /graph
summary: One or two sentences for the card.
doi: 10.xxxx/xxxxx        # optional
date: 2026-11-21
draft: false              # true hides it
---

## Your notes in Markdown…
```

The file name becomes the URL (`/notes/my-paper-2026/`) and the slug the terminal's `open` command uses.
To add a tag, extend `TAGS` in `src/content.config.ts` and add a `.tag--your-tag` color in `global.css`.

The six notes included are starter notes on real papers. Rewrite them in your own voice.

## Fill in before launch

- `[YOUR EMAIL]`, `[GOOGLE SCHOLAR]`, `[GITHUB]`, `[ORCID]` in `src/pages/index.astro` (the `contacts` list) and in `Terminal.astro` (`contact` command)
- `[YEAR]`, `[OFFICE / NUMBER]` and the placeholder paper in `src/data/publications.json`

## Deploy to lab.imatin.dev (Cloudflare Pages)

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Framework preset **Astro**, build command `npm run build`, output directory `dist`.
4. After the first deploy: **Custom domains → Set up a custom domain** → `lab.imatin.dev`.
   If imatin.dev's DNS is on Cloudflare, the record is added for you; otherwise add a `CNAME lab → <project>.pages.dev` at your DNS provider.
5. HTTPS is automatic (`.dev` requires it, so this matters).

Every `git push` redeploys. Vercel and Netlify work the same way (preset Astro, output `dist`).

If you deploy somewhere else, change `site` in `astro.config.mjs`.
