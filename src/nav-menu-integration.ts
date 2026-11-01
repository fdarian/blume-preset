import { fileURLToPath } from 'node:url';
import type { BlumeConfig } from 'blume';

type Integration = NonNullable<BlumeConfig['integrations']>[number];

// Loads the script that folds the header's tabs into a dropdown on every page.
// An absolute path, so a consumer's config needs no import map for it.
export function createNavMenuIntegration(): Integration {
	const scriptPath = fileURLToPath(new URL('./nav-menu.tsx', import.meta.url));

	return {
		name: 'blume-preset-nav-menu',
		hooks: {
			'astro:config:setup': (params: {
				injectScript: (stage: 'page', content: string) => void;
			}) => params.injectScript('page', `import ${JSON.stringify(scriptPath)};`),
		},
	};
}
