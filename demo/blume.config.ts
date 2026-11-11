import { withPreset } from '@fdarian/blume-preset';
import { defineConfig } from 'blume';

export default defineConfig(
	withPreset({
		title: 'Blume preset',
		github: {
			owner: 'fdarian',
			repo: 'blume-preset',
			branch: 'main',
			dir: 'demo',
		},
		navigation: {
			repo: false,
			tabs: [
				{ label: 'Docs', path: '/' },
				{ label: 'Guides', path: '/guides' },
			],
		},
	}),
);
