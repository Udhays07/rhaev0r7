# rhaev0r7

> I started with interfaces. Now I'm exploring the systems behind them.

The personal portfolio of **Udhaya Moorthy** (**rhaev0r7**), a software engineer moving from frontend toward backend, system design and applied AI.

The site is designed to feel like an engineer's notebook rather than a template. It uses editorial typography, one accent colour, thin rules instead of card grids, and interactions that reveal information instead of just decorating the page.

## Features

- **Terminal intro loader.** Each step resolves when the real work finishes (fonts, mount, page load, idle warm-up) and shows its measured time. It can be skipped with Esc, Enter, Space or a click.
- **rhaev0r7 signature.** The handle is set in mono with an orange `0` and a glyph "decode" effect. It appears in the nav, hero, terminal and a full-width footer wordmark.
- **Scroll-driven storytelling.**
  - Headlines reveal line by line.
  - The journey timeline and the "one layer deeper" staircase draw as you scroll (GSAP ScrollTrigger).
  - How I Think has a sticky step rail.
- **Interactive sections.**
  - The tech stack is a keyboard-navigable index with no skill percentages.
  - Engineering principles open as an accordion.
  - The Connect terminal has command history (↑/↓) and tab completion.
- **Light and dark themes.** It follows the system setting until the visitor chooses one, and applies the theme before first paint so there's no flash.
- **Accessibility.**
  - Semantic landmarks and a skip link.
  - Visible focus states, ARIA tabs and accordions.
  - Respects `prefers-reduced-motion`: the loader and scroll effects are skipped, and animations are reduced.
- **Mobile-first details.**
  - Full-screen menu.
  - 44px tap targets.
  - A 16px terminal input, so iOS doesn't zoom when it's focused.
- **Performance.**
  - Fonts are self-hosted.
  - No layout shift from animated content.
  - Heavy 3D code is loaded only when a section needs it.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, CSS custom-property design tokens |
| Animation | Motion, GSAP + ScrollTrigger |
| Smooth scrolling | Lenis (driven by the GSAP ticker) |
| 3D | React Three Fiber + Drei (hidden Playground section only) |
| Icons | Lucide React |
| Fonts | Fraunces, Geist, Geist Mono via Fontsource |

## Getting started

Requires Node.js 20 or later.

```bash
git clone https://github.com/Udhays07/rhaev0r7.git
cd rhaev0r7
npm install
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```text
src/
├── App.tsx                 # Page composition, intro loader, theme and motion providers
├── main.tsx
├── components/
│   ├── layout/             # Nav, Footer, Loader, SmoothScroll (Lenis + GSAP)
│   ├── sections/           # One file per page section
│   ├── playground/         # Similarity search, RAG pipeline, token lab, 3D vector space
│   └── ui/                 # Handle, SectionHeader, Reveal, RevealLines, icons
├── data/portfolioData.ts   # All site copy and content
├── hooks/                  # Theme, active section, media query, local time
├── lib/                    # Scroll helpers, intro context, utilities
├── styles/index.css        # Design tokens, themes, base styles
└── types/
```

## Editing content

Almost all text lives in [`src/data/portfolioData.ts`](src/data/portfolioData.ts): personal details and links, the tech stack, thinking steps, principles, learning stages and terminal commands. Change it there and every section updates.

Colours, fonts and themes are defined once as tokens at the top of [`src/styles/index.css`](src/styles/index.css).

## Hidden sections

Two finished sections are currently switched off:

- **Playground**: a semantic similarity search with a 3D vector space, a step-through RAG pipeline, and a live design-token lab.
- **Systems**: an "experience vs engineering" view of a question-bank feature. You can send requests through the architecture and watch the cache go from miss to hit.

To turn one back on:

1. Uncomment its import and JSX in [`src/App.tsx`](src/App.tsx).
2. Uncomment its nav entry in `NAV_SECTIONS` in `src/data/portfolioData.ts`.
3. Update the section numbers (`index="…"`) so they run in order.

## Deployment

It's a static site, so `npm run build` produces a `dist/` folder that can be hosted anywhere. On Vercel or Netlify, import the repo and use:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## Contact

- GitHub: [@Udhays07](https://github.com/Udhays07)
- LinkedIn: [in/udhayamoorthy](https://linkedin.com/in/udhayamoorthy)
- Email: [udhayamoorthysj@gmail.com](mailto:udhayamoorthysj@gmail.com)

---

Designed and built by **Udhaya Moorthy**, aka **rhaev0r7**.
