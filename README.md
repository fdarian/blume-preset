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
			component: '@fdarian/blume-preset/chapters',
			client: 'load',
		},
	},
});
```

`withPreset` sets accent, radius, mode, fonts and `markdown.externalLinks`. Anything you set in your own `theme` or `markdown` wins. It also adds an integration so the dev server can serve islands under pnpm's global virtual store.

## License

Apache-2.0
