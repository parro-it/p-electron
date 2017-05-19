export default {
	entry: 'main.js',
	dest: 'index.js',
	format: 'cjs',
	external: ['electron', 'delay', 'debug', 'p-event', 'p-timeout']
};
