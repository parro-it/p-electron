import {app} from 'electron';
import pEvent from 'p-event';
import pTimeout from 'p-timeout';
import delay from 'delay';

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
	if (window.isFocused()) {
		return Promise.resolve(true);
	}

	window.focus();

	if (window.isFocused()) {
		return Promise.resolve(true);
	}

	return pTimeout(
		pEvent(window, 'focus').then(() => true),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Focus promise');
		throw err;
	});
}

export function minimizeWindow(window) {
	if (window.isMinimized()) {
		return Promise.resolve(true);
	}
	window.minimize();
	let settled;
	return Promise.resolve().then(() =>
		window.isMinimized() ?

			Promise.resolve(true) :

			pTimeout(
				Promise.race([
					(async () => {
						while (!settled && !window.isMinimized()) { // eslint-disable-line no-unmodified-loop-condition
							await delay(200);	// eslint-disable-line no-await-in-loop
						}
						return true;
					})(),
					pEvent(window, 'minimize').then(() => {
						settled = true;
						return true;
					})
				]),
				5000
			).catch(err => {
				err.message = err.message.replace('Promise', 'Minimize promise');
				throw err;
			})
	);
}

export async function restoreWindow(window) {
	if (!window.isMinimized()) {
		return Promise.resolve(true);
	}

	window.restore();

	if (!window.isMinimized()) {
		return Promise.resolve(true);
	}

	return pTimeout(
		pEvent(window, 'restore').then(() => true),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Restore promise');
		throw err;
	});
}
