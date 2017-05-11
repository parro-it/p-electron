import test from 'ava';
import pElectron from '.';

test('exports a function', t => {
	t.is(typeof pElectron, 'function');
});
