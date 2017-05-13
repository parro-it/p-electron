import {app} from 'electron';
import pEvent from 'p-event';
import pTimeout from 'p-timeout';

export function appReady() {
	if (app.isReady()) {
		return Promise.resolve();
	}
	return pTimeout(
		pEvent(app, 'ready'),
		2000
	);
}

export function focusWindow(window) {
	window.focus();
	return pTimeout(
		pEvent(window, 'focus').then(() => true),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Focus promise');
		throw err;
	});
}

export function minimizeWindow(window) {
	window.minimize();
	return pTimeout(
		pEvent(window, 'minimize').then(() => true),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Minimize promise');
		throw err;
	});
}

export async function restoreWindow(window) {
	if (!window.isMinimized()) {
		return Promise.resolve(true);
	}
	const restored = pEvent(window, 'restore').then(() => true);

	window.restore();
	return pTimeout(restored, 500).catch(err => {
		err.message = err.message.replace('Promise', 'Restore promise');
		throw err;
	});
}
