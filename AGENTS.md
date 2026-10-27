Shared look and behavior for [Blume](https://useblume.dev) docs sites. Blume has no preset or plugin API, so this package ships the pieces a site wires up itself. Consumed as a git-tag dependency; never published to npm.

## Stack

- TypeScript and CSS shipped as source: `exports` point at `src/`, there is no build step.
- React + `@base-ui/react` for the chapter rail island; `blume`, `react`, `react-dom` are peers.

## Dev

- `pnpm run check:type` / `pnpm run check:lint` — checks
- `pnpm run format` — Biome write

## Architecture

- `src/index.ts` — `withPreset(config)`: theme/markdown defaults merged under the site's, integration prepended
- `src/allow-fs-integration.ts` — Astro integration that lets Vite serve `@astrojs/react` and this package from outside the project root
- `src/theme.css` — colors, typography, shell layout, chapter rail (`--preset-*` variables)
- `src/chapters.tsx` — client island for `layout.TableOfContents`

## Gotchas

- Blume reads `components.ts` statically, so sites list `@fdarian/blume-preset/chapters` literally; the package cannot register it.
- The config module is evaluated twice (jiti, then Astro): keep `src/index.ts` and the integration free of side effects.
- A release is a tag: after changing `src`, `git tag -f` or bump the version, and reinstall in the consumer.
