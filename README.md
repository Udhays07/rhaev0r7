# Portfolio

A single-page developer portfolio built with React, TypeScript and Tailwind CSS, with a 3D mascot, scroll-driven sections, and separate light and dark themes.

## Features

- **Animated intro.** A five-second drawn intro with a Skip button. Esc, Enter or Space also skip it, and visitors who prefer reduced motion see a still version.
- **3D mascot.** A character built from primitives in React Three Fiber, so there are no model files. It follows the cursor, reacts to clicks, and changes mood in response to the terminal.
- **Scroll-driven sections.**
  - A pinned statement that fills in word by word as you scroll.
  - A 3D layer stack that opens up as you scroll.
  - A sticky step rail and a staircase that builds itself.
- **Interactive pieces.**
  - A keyboard-navigable tech index.
  - An accordion.
  - A terminal with command history (↑/↓) and tab completion.
- **Two themes.** Light and dark are designed separately rather than one being an inversion of the other. The site follows the system setting until the visitor picks one, and applies the theme before first paint so there's no flash.
- **Accessibility.**
  - Semantic landmarks and a skip link.
  - Visible focus states, ARIA tabs and accordions.
  - A menu that keeps keyboard focus inside it.
  - Text that meets WCAG AA contrast in both themes.
  - Respect for `prefers-reduced-motion`.
- **Performance.**
  - Fonts are self-hosted.
  - There's no layout shift from animated content.
  - The 3D code loads as a separate chunk after the intro, and scenes stop rendering when they're off-screen.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, CSS custom-property design tokens |
| 3D | three.js, React Three Fiber, Drei |
| Animation | Motion, GSAP + ScrollTrigger |
| Smooth scrolling | Lenis |
| Icons | Lucide React |
| Fonts | Bricolage Grotesque, Geist Mono, Permanent Marker via Fontsource |

## Getting started

Requires Node.js 20 or later.

```bash
git clone <your-repo-url>
cd <your-repo-folder>
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
├── App.tsx                 # Page composition, intro, theme and motion providers
├── main.tsx
├── components/
│   ├── layout/             # Nav, Footer, Loader (+ intro/ scenes), SmoothScroll
│   ├── sections/           # One file per page section
│   ├── three/              # Mascot, 3D scenes, lazy loader, studio lighting
│   ├── playground/         # Optional interactive demos (hidden by default)
│   └── ui/                 # Handle, SectionHeader, Spray, Reveal, icons
├── data/portfolioData.ts   # All site copy and content
├── hooks/                  # Theme, active section, media query, local time
├── lib/                    # Scroll helpers, intro context, mascot mood events
├── styles/index.css        # Design tokens, themes, base styles
└── types/
```

## Customising

- **Content.** Almost all text lives in [`src/data/portfolioData.ts`](src/data/portfolioData.ts): your details and links, the tech stack, process steps, principles, learning stages and terminal commands. Change it there and every section updates.
- **Colours and themes.** These are defined once as tokens at the top of [`src/styles/index.css`](src/styles/index.css). Each theme sets its own values, and `.flood` sections re-map the same tokens.
- **The intro.** The intro shell in `Loader.tsx` handles timing, skipping and the exit. The animation itself is a swappable component in `components/layout/intro/`.
- **Hidden sections.** To turn on a hidden section, uncomment its import and JSX in [`src/App.tsx`](src/App.tsx) and its entry in `NAV_SECTIONS`.

## Deployment

It's a static site, so `npm run build` produces a `dist/` folder that can be hosted anywhere. On Vercel or Netlify, import the repo and use:

- **Build command:** `npm run build`
- **Output directory:** `dist`
