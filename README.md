# Curatio Styling Questionnaire

A mobile-first premium event styling questionnaire built with Next.js App Router, TypeScript, and Tailwind CSS.

## Design
A minimal **Swiss / high-contrast** aesthetic: stark white, bold type hierarchy, a strong grid, sharp-edged controls, and a single terracotta accent. No imagery — the design carries on typography, contrast and whitespace.

- Ink: `#14110f` (near-black)
- Accent: `#BA5110` (burnt terracotta)
- Surface: `#ffffff`
- Fonts: `Cormorant Garamond` for the wordmark + step numerals, `Inter` for everything else, mono for counters.

## Experience
- **One clear question per step** — big numbered headings, generous whitespace, crisp lettered answer blocks (selected = solid black).
- **Segmented progress** at the top doubles as clickable navigation between reachable steps.
- **Autosave + restore** — answers persist to `localStorage` with a "Saved · just now" status; returning visitors are offered Continue / Start fresh (also supports `#brief=…` resume links).
- **Auto-advance** — single-select picks move on once a step is complete (toggleable), with mobile **haptic feedback**.
- **View Transitions** — smooth cross-fade between steps (graceful fallback; respects reduced motion).
- **Surprise me** — fills a curated sample brief to preview the whole experience.
- **Share & download** — copy a shareable resume link, or **Download PDF** via a print-optimized one-page brief.
- **Keyboard nav** — press `Enter` to advance (submits on the last step).

## File structure
- `app/layout.tsx` — page shell, fonts, metadata
- `app/page.tsx` — white wrapper that mounts the questionnaire
- `app/globals.css` — global Tailwind, Swiss base styles (underline inputs, motion, print)
- `components/CuratioQuestionnaire.tsx` — the whole experience: layout, steps, autosave, auto-advance, share, controls
- `components/curatioSteps.ts` — shared types, options, step metadata, progress helpers, sample brief, share encoding
- `components/PrintBrief.tsx` — print-only formatted brief for Download / Save-as-PDF
- `apps-script/curatio-form-webapp.gs` — Google Apps Script endpoint to receive submissions
- `apps-script/README.md` — instructions for deploying the Apps Script Web App

## Run locally
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Apps Script setup
Open `apps-script/README.md` for step-by-step instructions on deploying the Google Apps Script endpoint and connecting it to the app.
