// Import dependencies.
let sh = require('shelljs');
let watch = require('node-watch');
let chalk = require('chalk');
let fs = require('fs');
let glob = require('glob');

let compiling = false;
let delay;

// Compile function using tsconfig.json.
let compile = () => {
	delay = setTimeout(() => {
		if (compiling)
			return;
		clearTimeout(delay);
		compiling = true;
		sh.exec('tsc -p ./src/tsconfig.json', {}, () => {
			compiling = false;
			defs();
		});
	}, 100);
};

// Bundle Type Definitions
let defs = () => {
	sh.exec('dts-bundle --name facile --main ./dist/index.d.ts --out index.d.ts', {}, (e) => {
		del();
	});
};

// Remove Duplicate Definitions.
let del = () => {
	glob('./dist/*.d.ts', (err, files) => {
		if (err)
			return console.log(chalk.red('Error: ') + err.message);
		files.forEach((f) => {
			if (!/dist\/index\.d\.ts/.test(f))
				fs.unlink(f, (err) => {
					if (err)
						console.log(chalk.red('Error: ') + err.message);
				});
		});
	});
};

// Create directory watcher.
let watcher = watch('src', { recursive: true });

// Watch for changes.
watcher.on('change', (f) => {
	console.log(chalk.magenta('changed: ') + f);
	compile();
});

// Watch for errors.
watcher.on('error', (f) => {
	console.log(chalk.red('failed: ') + f);
	clearTimeout(delay);
});

console.log(chalk.cyan('\nTypescript watching for changes\n-------------------------------\n'));

