Shared look and behavior for [Blume](https://useblume.dev) docs sites. Blume has no preset or plugin API, so this package ships the pieces a site wires up itself. Consumed as a git-tag dependency; never published to npm.

## Stack

- TypeScript and CSS shipped as source: `exports` point at `src/`, there is no build step.
- React + `@base-ui/react` for the chapter rail island; `blume`, `react`, `react-dom` are peers.

## Dev

- `pnpm run check:type` / `pnpm run check:lint` — checks
- `pnpm run format` — Biome write
- `pnpm run demo` — dev server for `demo/`

## Architecture

- `src/index.ts` — `withPreset(config)`: theme/markdown defaults merged under the site's, integration prepended
- `src/allow-fs-integration.ts` — Astro integration that lets Vite serve `@astrojs/react` and this package from outside the project root
- `src/nav-menu.tsx` — client script (injected into every page by `src/nav-menu-integration.ts`) that mounts a Base UI popover turning the header tabs into a sidebar dropdown from 72rem
- `src/theme.css` — colors, typography, shell layout, chapter rail (`--preset-*` variables)
- `src/chapters.tsx` — client island for `layout.TableOfContents`
- `src/sidebar.astro` — optional `layout.Sidebar` replacement: `NavTree` plus a footer row (version, GitHub, search, theme toggle); `theme.css` hides the header's search and toggle from 72rem when it is present
- `demo/` — private workspace Blume site that consumes the preset by package name, the way a real site does

## Gotchas

- Biome's `noUnusedImports` can't see template usage in `.astro` files and deletes component imports, so `biome.jsonc` turns it off for them.
- Blume reads `components.ts` statically, so sites list `@fdarian/blume-preset/chapters.tsx` literally (Blume picks the framework from the file extension, so the export keeps `.tsx`); the package cannot register it.
- The config module is evaluated twice (jiti, then Astro): keep `src/index.ts` and the integration free of side effects.
- A release is a tag: after changing `src`, `git tag -f` or bump the version, and reinstall in the consumer.
