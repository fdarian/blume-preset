import { defineConfig } from 'blume';
import { withPreset } from '@fdarian/blume-preset';

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
			tabs: [
				{ label: 'Docs', path: '/' },
				{ label: 'Guides', path: '/guides' },
			],
		},
	}),
);
