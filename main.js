import {app} from 'electron';
import pEvent from 'p-event';
import pTimeout from 'p-timeout';
import {default as _debug} from 'debug';

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
		2000
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

export const focusWindow = resolveWithTimeout((win, resolve) => {
	if (win.isFocused() || !win.isVisible()) {
		return resolve(true);
	}
	win.on('focus', resolve);
	win.focus();

	function check() {
		if (win.isFocused()) {
			return resolve(true);
		}
		setTimeout(check);
	}

	check();
}, 'Focus promise');

export const minimizeWindow = resolveWithTimeout((win, resolve) => {
	debug('----- start of resolver ----------', win.isVisible());
	if (win.isMinimized() || !win.isVisible()) {
		return resolve(true);
	}

	win.on('minimize', resolve);
	debug('----- before minimize ----------', win.isVisible());
	win.minimize();
	debug('----- after minimize ----------', win.isVisible());
}, 'Minimize promise');

export const restoreWindow = resolveWithTimeout((win, resolve) => {
	debug('*************** -->', win.isMinimized(), win.isVisible());
	if (!win.isMinimized()) {
		return resolve(true);
	}

	win.on('restore', resolve);
	setTimeout(() => win.restore());
}, 'Restore promise');
