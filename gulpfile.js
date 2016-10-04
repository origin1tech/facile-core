let gulp = require('gulp');
let tsproject = require('tsproject');

gulp.task('bundle', () => {
	tsproject.src('src/tsconfig.json')
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['bundle']);