# sqlclr.com

Personal brand site for Kurt M. Kluth — SQL Server architect. Built with [Astro](https://astro.build).

## Develop

```sh
npm install
npm run dev        # http://localhost:4321
```

## Build & deploy

```sh
npm run build      # outputs static site to ./dist
```

The build is fully static — deploy `dist/` to any static host or web server
(Nginx, IIS, Cloudflare Pages, Netlify, Vercel, GitHub Pages). No Node runtime
is needed in production.

The **Work** section is populated from the GitHub API at build time
(`src/components/Projects.astro`, user `kurtkluth`), so rebuild to refresh the
project list. If the API is unreachable during a build, the section degrades to
a profile link.

## Structure

- `src/pages/index.astro` — single page, composed of components
- `src/components/` — Nav, Hero, Story (timeline), Practice, Projects, Contact
- `src/layouts/Base.astro` — head metadata, JSON-LD, scroll-reveal script
- `src/styles/global.css` — design tokens and shared styles
- `public/og.png` — social share card (regenerate with `pwsh tools/make-og.ps1`)

## Brand assets

`public/favicon.svg` is the live favicon (monogram K). Alternate marks are kept
alongside it — swap any of them in by copying over `favicon.svg`:

- `favicon-monogram.svg` — gradient K monogram (active)
- `favicon-cylinder.svg` — database cylinder
- `favicon-boundary.svg` — governed boundary with ember core
- `favicon-brackets.svg` — T-SQL `[identifier]` brackets with ember dot
- `favicon-stack.svg` — layered data stack, ember base

`tools/make-og.ps1` regenerates the 1200×630 Open Graph card at `public/og.png`
(System.Drawing, so Windows-only).
