# AI Agent Guidelines for dago-idejos

## Project Overview
This is a **minimalist static site generator** for sharing curated ideas (idėjos), built with **Eleventy (11ty) v3.1.2** and **Sass v1.93.0**. The site prioritizes performance through inline CSS and is written in **Lithuanian**.

## Key Architecture Patterns

### 1. Single-Source-of-Truth Data Loading
- Content lives in **`_includes/idejos.md`** (YAML front matter + Markdown body)
- `_data/idejos.js` parses this file using `gray-matter`, extracts updates array and latest metadata
- **Pattern**: Always read via the data layer (`idejos` global in templates), never direct file access
- **Example**: Template accesses `idejos.latest.date`, `idejos.body` — these are parsed from the single .md file

### 2. Inline CSS Pipeline (Critical for Performance)
- **Entry point**: `bundle.scss` imports partials from `assets/styles/`
- **Compilation**: `.eleventy.js` defines `inlineBundleCss` shortcode that:
  - Compiles Sass with `style: "compressed"` (minified)
  - Returns `<style>{{ result.css }}</style>` tags injected into `base.html`
  - **Caches result** to avoid recompilation (invalidated on SCSS changes)
- **Layout**: `_includes/base.html` calls `{% inlineBundleCss %}` in `<head>`
- **Why inline?**: Eliminates external CSS requests, improves Core Web Vitals for static content

### 3. Watch Targets & Rebuild Triggers
- Eleventy watches: `.md`, `.html`, `.eleventy.js`
- **Explicit watch targets** in config for SCSS changes:
  - `eleventyConfig.addWatchTarget("./bundle.scss")`
  - `eleventyConfig.addWatchTarget("./assets/styles/")`
- **Dev workflow**: `npm start` runs Eleventy + Sass watcher in parallel
- **Important**: Changes to Sass invalidate inline CSS cache via Eleventy rebuild

## Build & Development Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server (Eleventy + Sass watcher) — browser live reload enabled |
| `npm run watch:eleventy` | Eleventy dev server only (port 8080) |
| `npm run watch:sass` | Sass watcher only (outputs to `_site/bundle.css`) |
| `npx @11ty/eleventy` | One-time production build |

**Note**: Development runs both in parallel for real-time feedback; production uses single build pass.

## Styling Architecture
- **Sass structure**: `_variables.scss` (theme colors, spacing), `_reset.scss` (baseline), `_theme.scss` (component styles)
- **Language**: All style partial files use Sass (`.scss`)
- **Namespace**: All partials prefixed with `_` to prevent standalone compilation
- **Load paths**: Configured in `.eleventy.js` with `loadPaths: ["."]` to resolve `@use` from project root

## Template & Markdown Patterns

### Page Structure
- **Layouts**: All pages use `base.html` layout (set in front matter: `layout: base.html`)
- **Content delivery**: Markdown rendered as `{{ content }}` in main template
- **Custom shortcodes** available:
  - `{% inlineBundleCss %}` — injects compiled CSS
  - `{% idejosBody idejos %}` — renders idea body content (strips YAML front matter)

### Metadata & Front Matter (YAML)
- **Global site data**: `_data/site.json` (title, description, URL)
- **Dynamic page metadata**: Front matter in `.md` files (`title`, `description`, etc.)
- **Social sharing**: `base.html` auto-generates OG/Twitter tags from page metadata (fallbacks to site defaults)

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `.eleventy.js` | Config: Sass compilation, shortcodes, filters, watch targets, passthrough copy |
| `bundle.scss` | Main Sass entry — imports all partials |
| `assets/styles/` | Sass partial modules (never output as standalone CSS) |
| `_includes/base.html` | Master HTML template (inlines CSS, sets up page structure) |
| `_includes/idejos.md` | Single source of truth for ideas + update history |
| `_data/idejos.js` | Parser: extracts YAML front matter, sorts updates, exposes to templates |
| `_data/site.json` | Site-wide metadata (title, description) |
| `index.md` | Homepage — renders ideas list via `{% idejosBody idejos %}` |

## Development Conventions

### When Modifying Styles
1. **Edit partials in** `assets/styles/` (not bundle.scss directly)
2. **Import partials in** `bundle.scss` using `@use "assets/styles/..."`
3. **Save** → Sass watcher recompiles → Eleventy detects bundle.scss change → invalidates CSS cache → rebuild
4. **Dev feedback**: Browser auto-reloads via Eleventy live reload

### When Updating Ideas
1. **Edit** `_includes/idejos.md`
2. **Keep YAML front matter** (updates array with `date` and `count` fields)
3. **Body content** is raw Markdown — gets parsed via `gray-matter` → accessible as `idejos.body`
4. **Save** → `_data/idejos.js` re-runs → templates see fresh data

### Asset Management
- **Images**: Place in `assets/img/`, auto-copied to `_site/` via passthrough copy
- **Favicon**: `assets/img/dago-icon.png` referenced in base.html
- **SVG/Icons**: Use as image or inline in CSS/HTML (not as separate font)

## Filters & Shortcodes Reference
- **`dateYMD` filter**: Converts date to `YYYY-MM-DD` format (used in homepage metadata display)
- **`idejosBody` shortcode**: Extracts and renders just the body content from idejos object (excludes YAML)

## Performance Considerations
- ✅ **CSS inlined** — no external stylesheet requests
- ✅ **Sass compressed** — minified output
- ✅ **Smart caching** — CSS cache invalidated only when Sass changes
- ✅ **No JavaScript required** — pure static HTML + CSS
- ✅ **Passthrough copy only for images** — minimal file duplication
- ⚠️ **Watch cache**: Explicitly clear if config changes don't trigger rebuild (rare)

## Lithuanian Language Notes
- Site title: "dago / idėjos" (special characters preserved)
- HTML lang: `lt-LT`
- Content: All markdown and templates use Lithuanian
- Consider locale-aware date formatting in future enhancements

## When Adding Features
1. **Shortcodes**: Add to `.eleventy.js` (`eleventyConfig.addShortcode`)
2. **Filters**: Add to `.eleventy.js` (`eleventyConfig.addFilter`)
3. **Data**: Create files in `_data/` (auto-exposed as globals)
4. **Templates**: Create `.html` in `_includes/` and reference via `layout` front matter
5. **Styles**: Add partials to `assets/styles/`, import in `bundle.scss`
6. **Static assets**: Use passthrough copy in `.eleventy.js` for directories that should bypass processing
