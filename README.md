# @fdarian/blume-preset

A quiet, centered docs look for [Blume](https://useblume.dev): sidebar hanging off the article, small type, and a floating chapter rail instead of a right-hand table of contents.

## Install

Not on npm. Install from a git tag:

```sh
pnpm add github:fdarian/blume-preset#v0.1.0
```

## Use

Blume has no preset mechanism, so three files in your site wire it up.

```ts
// blume.config.ts
import { defineConfig } from 'blume';
import { withPreset } from '@fdarian/blume-preset';

export default defineConfig(
	withPreset({
		title: 'My docs',
		// site-specific config only
	}),
);
```

```css
/* theme.css */
@import "@fdarian/blume-preset/theme.css";
```

```ts
// components.ts
import { defineComponents } from 'blume';

export default defineComponents({
	layout: {
		TableOfContents: {
			component: '@fdarian/blume-preset/chapters.tsx',
			client: 'load',
		},
	},
});
```

`withPreset` sets accent, radius, mode, fonts and `markdown.externalLinks`. Anything you set in your own `theme` or `markdown` wins. It also adds an integration so the dev server can serve islands under pnpm's global virtual store.

If your site sets `navigation.tabs`, from 1152px up the tabs fold into a dropdown under the logo instead of a bar across the header. `withPreset` injects the script for it, so there is nothing more to wire up.

## Demo

A sample site that uses the preset lives in `demo/`:

```sh
pnpm install
pnpm run demo
```

## License

Apache-2.0
