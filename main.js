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
export function focusWindow(win) {
	return pTimeout(
		new Promise(resolve => {
			if (win.isFocused()) {
				return resolve();
			}
			win.on('focus', resolve);
			win.focus();
		}).then(() => new Promise(resolve => {
			function check() {
				if (win.isFocused()) {
					return resolve(true);
				}
				setTimeout(check);
			}
			check();
		})),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Focus promise');
		throw err;
	});
}

export function minimizeWindow(win) {
	return pTimeout(
		new Promise(resolve => {
			if (win.isMinimized()) {
				return resolve();
			}

			win.on('minimize', resolve);
			win.minimize();
		}),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Minimize promise');
		throw err;
	});
}

export async function restoreWindow(win) {
	return pTimeout(
		new Promise(resolve => {
			if (!win.isMinimized()) {
				return resolve();
			}

			win.on('restore', resolve);
			win.restore();
		}),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Restore promise');
		throw err;
	});
}
