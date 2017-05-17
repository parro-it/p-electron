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

function resolveWithTimeout(resolver, promiseName) {
	return pTimeout(
		new Promise(resolver),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', promiseName);
		throw err;
	});
}

export const windowVisible = win => {
	if (win.isVisible()) {
		// To debug -- console.log('windowVisible: isVisible === true');
		return Promise.resolve(true);
	}
	return resolveWithTimeout(resolve => {
		// To debug -- console.log('resolveWithTimeout on show event');
		win.on('show', resolve);
	}, 'windowVisible promise');
};

export function focusWindow(win) {
	return pTimeout(
		new Promise(resolve => {
			if (win.isFocused() || !win.isVisible()) {
				return resolve(true);
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
			// To debug -- console.log('----- start of resolver ----------', win.isVisible())
			if (win.isMinimized() || !win.isVisible()) {
				return resolve(true);
			}

			win.on('minimize', resolve);
			// To debug -- console.log('----- before minimize ----------', win.isVisible())
			win.minimize();
			// To debug -- console.log('----- after minimize ----------', win.isVisible())
		}),
		500
	).catch(err => {
		err.message = err.message.replace('Promise', 'Minimize promise');
		throw err;
	});
}

export function restoreWindow(win) {
	// To debug -- console.error('*************** restoreWindow')
	return pTimeout(
		new Promise(resolve => {
			// To debug -- console.error('*************** -->', win.isMinimized(), win.isVisible())
			if (!win.isMinimized()) {
				return resolve(true);
			}

			win.on('restore', resolve);
			setTimeout(() => win.restore());
		}),
		2000
	).catch(err => {
		err.message = err.message.replace('Promise', 'Restore promise');
		throw err;
	});
}
