import {app} from 'electron';
import pEvent from 'p-event';

export function appReady() {
	if (app.isReady()) {
		return Promise.resolve();
	}
	return pEvent(app, 'ready');
}

