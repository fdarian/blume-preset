import { Popover } from '@base-ui/react/popover';
import { useEffect, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

type Link = { label: string; href: string; current: boolean };
type Entry =
	| { kind: 'link'; link: Link }
	| { kind: 'group'; label: string; current: boolean; items: Link[] };

const SIDEBAR_QUERY = '(min-width: 72rem)';

function requireText(node: Node, what: string) {
	const text = node.textContent?.trim();
	if (!text) {
		throw new Error(`Blume header nav ${what} has no text`);
	}
	return text;
}

function readLink(anchor: HTMLAnchorElement, label: string): Link {
	const href = anchor.getAttribute('href');
	if (!href) {
		throw new Error(`Blume header nav link "${label}" has no href`);
	}
	return {
		label,
		href,
		current: anchor.getAttribute('aria-current') === 'page',
	};
}

// The header's tab bar is Blume's own markup, so the menu is built from it:
// a tab is a link, or a <details> when it has dropdown items
function readEntries(nav: HTMLElement) {
	return Array.from(nav.children).map((child): Entry => {
		if (child instanceof HTMLAnchorElement) {
			return {
				kind: 'link',
				link: readLink(child, requireText(child, 'tab')),
			};
		}
		const summary = child.querySelector('summary');
		if (child instanceof HTMLDetailsElement && summary) {
			return {
				kind: 'group',
				label: requireText(summary, 'tab'),
				current: summary.getAttribute('aria-current') === 'true',
				items: Array.from(child.querySelectorAll('a')).map((anchor) => {
					// An item's label comes first, ahead of its tag and description
					const label = document
						.createTreeWalker(anchor, NodeFilter.SHOW_TEXT)
						.nextNode();
					if (!label) {
						throw new Error('Blume header nav item has no label');
					}
					return readLink(anchor, requireText(label, 'item'));
				}),
			};
		}
		throw new Error('Unexpected child in the Blume header nav');
	});
}

function currentLabel(entries: Entry[], fallback: string) {
	for (const entry of entries) {
		if (entry.kind === 'link' && entry.link.current) {
			return entry.link.label;
		}
		if (entry.kind === 'group' && entry.current) {
			return entry.label;
		}
	}
	return fallback;
}

function NavLink(props: { link: Link; onNavigate: () => void }) {
	return (
		<li>
			<a
				href={props.link.href}
				aria-current={props.link.current ? 'page' : undefined}
				onClick={props.onNavigate}
			>
				{props.link.label}
			</a>
		</li>
	);
}

function NavMenu(props: { entries: Entry[]; label: string }) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const query = matchMedia(SIDEBAR_QUERY);
		const close = () => {
			if (!query.matches) {
				setOpen(false);
			}
		};
		query.addEventListener('change', close);
		return () => query.removeEventListener('change', close);
	}, []);

	const close = () => setOpen(false);

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger className="preset-nav-trigger">
				{currentLabel(props.entries, props.label)}
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner
					className="preset-nav-positioner"
					side="bottom"
					align="start"
					sideOffset={6}
				>
					<Popover.Popup className="preset-nav-popup">
						<nav aria-label={props.label}>
							<ul>
								{props.entries.map((entry) =>
									entry.kind === 'link' ? (
										<NavLink
											key={entry.link.href}
											link={entry.link}
											onNavigate={close}
										/>
									) : (
										<li key={entry.label}>
											<span className="preset-nav-group">{entry.label}</span>
											<ul>
												{entry.items.map((item) => (
													<NavLink
														key={item.href}
														link={item}
														onNavigate={close}
													/>
												))}
											</ul>
										</li>
									),
								)}
							</ul>
						</nav>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}

type Mounted = { root: Root; container: HTMLElement };

let mounted: Mounted | null = null;

function unmount() {
	mounted?.root.unmount();
	mounted?.container.remove();
	mounted = null;
}

// The header is rebuilt on every client-router swap, so the menu is too
function mount() {
	unmount();
	const nav = document.querySelector<HTMLElement>(
		'header[data-blume-header] > nav',
	);
	if (!nav) {
		return;
	}
	const label = nav.getAttribute('aria-label');
	if (!label) {
		throw new Error('Blume header nav has no aria-label');
	}
	const container = document.createElement('div');
	container.setAttribute('data-preset-nav-root', '');
	nav.before(container);
	const root = createRoot(container);
	root.render(<NavMenu entries={readEntries(nav)} label={label} />);
	mounted = { root, container };
}

document.addEventListener('astro:before-swap', unmount);
document.addEventListener('astro:after-swap', mount);
mount();
