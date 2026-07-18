# Changelog

A history of notable changes to sqlclr.com. Newest entries first. Commit hashes refer to
[github.com/kurtkluth/sqlclr.com](https://github.com/kurtkluth/sqlclr.com).

## 2026-07-18

### Light and dark mode

- Added a full light theme alongside the existing dark theme. All color tokens now resolve
  per theme through `:root[data-theme='light' | 'dark']` in `global.css`, with new helper
  tokens (`--tint`, `--bg-card-2`, `--fill-soft`, `--selection`, `--theme-color`) so the
  section bands, cards, and chips that previously used hard-coded colors adapt cleanly.
- A sun/moon toggle in the nav switches themes; the choice is saved to `localStorage` and
  applied before first paint by an inline script in the head, so there is no flash. First
  visits follow the OS `prefers-color-scheme`, defaulting to dark. The `theme-color` meta
  updates with the active theme.
- The Hero terminal stays dark in both themes by design, reading as a code-editor island.

## 2026-07-14

### Prose style pass (`6a4ecb9`)

- Removed every em and en dash from rendered prose across all four pages, rewriting
  sentences with periods and commas. Timeline era labels now read "1998 to 2005" form,
  page titles use comma and pipe separators, and the footer brand line uses middots.
- Regenerated the Open Graph card and updated the GitHub repo description to match,
  since the Work section renders that description at build time.
- Standing rule going forward: no em or en dashes in site copy.

### Footer attribution (`792d1ca`)

- Replaced the footer credit with "Crafted by the Kluth Studios team," linking to
  [kluthstudios.com](https://kluthstudios.com).

### Legal pages trimmed to content-only scope (`5a4a7bc`)

- Rewrote the Terms of Service and Privacy Policy to describe what the site actually is:
  a static content site with no accounts, payments, uploads, cookies, or analytics.
- Removed account registration, payment and subscription, user-content licensing, and
  account termination clauses; renumbered the remaining sections.
- Data collection now covers only inbound email and host server logs. The no-cookies
  claim was verified against the running site before publishing.

### Legal pages added (`b8ccba1`)

- Added Terms of Service (/terms), Privacy Policy (/privacy), and Legal Disclaimer
  (/disclaimer) as markdown pages with a shared dark legal layout, adapted from the
  kurtkluth.com boilerplate. Entity and domain references became sqlclr.com; the
  support@kurtkluth.com contact, P.O. Box 420 address, and phone number were kept.
- Extracted the footer into its own component with links to all three legal pages.
- Canonical and og:url tags are now per-page instead of always the site root, and nav
  anchors work from any page.
- Dev server now falls back to a free port when 4321 is taken by another project.

### Name change (`baa7789`)

- "Kurt M. Kluth" became "Kurt Kluth" in the hero, page title, footer, JSON-LD
  structured data, README, Open Graph card, and the GitHub repo description.

### Security upgrade (`ae9924a`)

- Upgraded Astro 5.18.2 to 6.4.8 and forced esbuild to 0.28.1 or newer via an npm
  override, clearing all eight findings from a dependency vulnerability scan (five
  Astro CVEs and two esbuild advisories, one of them withdrawn). npm audit reports
  zero vulnerabilities.

### Book reference (`4eb19be`)

- Added a citation to Gama and Naughter, "Super SQL Server Systems" (2006), the canon
  of the extended stored procedure era, to the first story chapter.

### Initial site (`4a842de`)

- Single-page Astro site: hero with a T-SQL terminal, a three-chapter story of the xp_
  era through modern SQLCLR, six practice capability cards, a Work section fetched live
  from the GitHub API at build time, and a contact section.
- Five favicon marks (monogram K active, matching the nav icon), an Open Graph card
  generator (tools/make-og.ps1), scroll reveals with a progressive-enhancement gate and
  a stalled-renderer fail-safe, JSON-LD person schema, and a mobile overflow fix.
- Published to GitHub as a public repository the same day.
