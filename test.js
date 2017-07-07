'use strict';
const {BrowserWindow, app} = require('electron');
const test = require('tape-async');
const delay = require('delay');
const {
	appReady,
	focusWindow,
	minimizeWindow,
	restoreWindow,
	windowVisible
} = require('.');

let win;

test('exports an appReady function', async t => {
	t.is(typeof appReady, 'function');
});

test('appReady return a promise that resolve when electron app is ready', async t => {
	await appReady();
	// We could create a window, because the app is ready
	win = new BrowserWindow({show: false});
	await delay(400);
	t.is(typeof win, 'object');
});

test('focusWindow return a promise that resolve when window is focused', async t => {
	const browser = new BrowserWindow();
	// browser.loadURL(`file://${__dirname}/index.html`);
	await windowVisible(browser);
	t.true(await focusWindow(browser));
	t.true(browser.isFocused());

	browser.close();
});

test('minimizeWindow return a promise that resolve when window is minimized', async t => {
	const browser = new BrowserWindow();
	await windowVisible(browser);
	t.false(browser.isMinimized());
	t.true(await minimizeWindow(browser));
	t.true(browser.isMinimized());
	browser.close();
});

test('restoreWindow return a promise that resolve when window is restored', async t => {
	const browser = new BrowserWindow();
	await windowVisible(browser);
	t.true(await minimizeWindow(browser));
	t.true(browser.isMinimized());
	t.true(await restoreWindow(browser));
	await delay(100);
	t.false(browser.isMinimized());
	browser.close();
});

test('app quit', t => {
	app.on('window-all-closed', () => app.quit());
	t.end();
	win.close();
});
