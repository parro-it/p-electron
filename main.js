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
	return pEvent(window, 'focus');
}

export function minimizeWindow(window) {
	window.minimize();
	return pEvent(window, 'minimize');
}
