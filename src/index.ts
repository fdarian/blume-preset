import type { BlumeConfig } from 'blume';
import { createAllowFsIntegration } from './allow-fs-integration.ts';
import { createNavMenuIntegration } from './nav-menu-integration.ts';

const presetTheme: NonNullable<BlumeConfig['theme']> = {
	accent: 'blue',
	radius: 'lg',
	mode: 'light',
	fonts: { display: 'inter', body: 'inter', mono: 'geist-mono' },
};

// Blume has no preset mechanism, so the site's own config always wins: theme
// and markdown are shallow-merged over the preset's, integrations are prepended.
export function withPreset(config: BlumeConfig): BlumeConfig {
	return {
		...config,
		theme: { ...presetTheme, ...config.theme },
		markdown: { externalLinks: true, ...config.markdown },
		integrations: [
			createAllowFsIntegration(),
			createNavMenuIntegration(),
			...(config.integrations ?? []),
		],
	};
}
