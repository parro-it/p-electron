import {app} from 'electron';
import pEvent from 'p-event';
import pTimeout from 'p-timeout';
import {default as _debug} from 'debug';
import delay from 'delay';

const debug = _debug('p-electron');

export function appReady() {
	if (app.isReady()) {
		return Promise.resolve();
	}
	return pTimeout(
		pEvent(app, 'ready'),
		2000
	);
}

const resolveWithTimeout = (resolver, promiseName) => win =>
	pTimeout(
		new Promise(resolve => resolver(win, resolve)),
		2000000
	).catch(err => {
		err.message = err.message.replace('Promise', promiseName);
		throw err;
	});

export const windowVisible = win => {
	if (win.isVisible()) {
		debug('windowVisible: isVisible === true');
		return Promise.resolve(true);
	}

	return resolveWithTimeout((win, resolve) => {
		debug('resolveWithTimeout on show event');
		win.on('show', resolve);
	}, 'windowVisible promise')(win);
};

export const windowClosed = win => {
	if (win.isDestroyed()) {
		debug('windowClosed: isDestroyed === true');
		return Promise.resolve(true);
	}

	return resolveWithTimeout((win, resolve) => {
		debug('resolveWithTimeout on closed event');
		win.on('closed', resolve);
	}, 'windowClosed promise')(win);
};

export const focusWindow = resolveWithTimeout(async (win, resolvePromise) => {
	let resolved = false;
	const resolve = value => {
		if (resolved) {
			return;
		}
		resolvePromise(value);
		resolved = true;
	};

	if (win.isFocused() || !win.isVisible()) {
		return resolve(true);
	}

	win.on('focus', async () => {
		await delay(100);
		resolve(true);
	});

	win.focus();
}, 'Focus promise');

export const minimizeWindow = resolveWithTimeout(async (win, resolve) => {
	if (win.isMinimized()) {
		return resolve(true);
	}

	win.on('minimize', () => {
		resolve(true);
	});

	win.minimize();
}, 'Minimize promise');

export const restoreWindow = resolveWithTimeout(async (win, resolve) => {
	if (!win.isMinimized()) {
		return resolve(true);
	}

	win.on('restore', () => {
		resolve(true);
	});
	win.restore();
}, 'Restore promise');
