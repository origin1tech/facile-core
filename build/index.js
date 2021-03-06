
// Import dependencies.
let sh = require('shelljs');
let watch = require('node-watch');
let chalk = require('chalk');
let fs = require('fs');
let glob = require('glob');
let argv = process.argv.splice(2);
let pkg = require('../package.json');

let compiling = false;
let delay;

// Tests if argv containis value.
let hasArg = (arg) => {
	if (!Array.isArray(arg))
		arg = [arg];
	let result = false;
	arg.forEach((val) => {
		if (result)
			return;
		if (argv.indexOf(val) !== -1)
			result = true;
	});
	return result;
}

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

// Build out the docs.
let docs = () => {
	sh.exec('tsdoc', {}, (err) => {
		console.log(chalk.cyan('Documentation: ') + 'completed.\n');
		process.exit();
	});
};

// Commit the project to github.
let commit = () => {

	let ver = pkg.version.split('.');
	let patch = parseInt(ver.pop());

	sh.exec('tsdoc', {}, (err) => {
		console.log(chalk.cyan('Documentation: ') + 'completed.\n');
		process.exit();
	});

};

// Build out docs only.
if (argv.indexOf('--docs') !== -1) {
	docs();
}

// Otherwise compile and watch for changes.
else {

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

	// Run initial compilation.
	compile();

	console.log(chalk.cyan('\nTypescript watching for changes\n-------------------------------\n'));

}



