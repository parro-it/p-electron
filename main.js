import {app} from 'electron';
import pEvent from 'p-event';

export function appReady() {
	if (app.isReady()) {
		return Promise.resolve();
	}
	return pEvent(app, 'ready');
}

export function focusWindow(window) {
	window.focus();
	return pEvent(window, 'focus').then(() => true);
}

export function minimizeWindow(window) {
	window.minimize();
	return pEvent(window, 'minimize').then(() => true);
}

export async function restoreWindow(window) {
	if (!window.isMinimized()) {
		return Promise.resolve(true);
	}
	const restored = pEvent(window, 'restore').then(() => true);
	window.on('restore', () => console.error('restore called'));

	window.restore();
	return restored;
}
