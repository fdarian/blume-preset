import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BlumeConfig } from 'blume';

type Integration = NonNullable<BlumeConfig['integrations']>[number];

// Under pnpm's global virtual store, both Blume's React renderer and this
// package live outside the directories Blume lets the dev server read, so
// islands never hydrate in dev unless Vite is told to serve them.
export function createAllowFsIntegration(): Integration {
	const blumeRequire = createRequire(import.meta.resolve('blume'));
	const astroReactDir = dirname(
		blumeRequire.resolve('@astrojs/react/package.json'),
	);
	const presetDir = fileURLToPath(new URL('..', import.meta.url));

	return {
		name: 'blume-preset-allow-fs',
		hooks: {
			'astro:config:setup': (params: {
				updateConfig: (config: object) => void;
			}) =>
				params.updateConfig({
					vite: { server: { fs: { allow: [astroReactDir, presetDir] } } },
				}),
		},
	};
}
