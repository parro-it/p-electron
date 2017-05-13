'use strict';
const {BrowserWindow, app} = require('electron');
const test = require('tape-async');
const {appReady, focusWindow, minimizeWindow} = require('.');

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

test('focusWindow return a promise that resolve when window is focused', async t => {
	const browser = new BrowserWindow();
	t.false(browser.isFocused());
	t.true(await focusWindow(browser));
	t.true(browser.isFocused());
	browser.close();
});

test('minimizeWindow return a promise that resolve when window is minimized', async t => {
	const browser = new BrowserWindow();
	t.false(browser.isMinimized());
	t.true(await minimizeWindow(browser));
	t.true(browser.isMinimized());
	browser.close();
});

test('app quit', t => {
	app.on('window-all-closed', () => app.quit());
	t.end();
	win.close();
});
