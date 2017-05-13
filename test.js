'use strict';
const {BrowserWindow, app} = require('electron');
const test = require('tape-async');
const {appReady} = require('.');

let win;

test('exports an appReady function', async t => {
	t.is(typeof appReady, 'function');
});

test('appReady return a promise that resolve when electron app is ready', async t => {
	await appReady();
	// We could create a window, because the app is ready
	win = new BrowserWindow();
	t.is(typeof win, 'object');
});

test('app quit', t => {
	app.on('window-all-closed', () => app.quit());
	t.end();
	win.close();
});
