var gulp = require('gulp');
var gulpSass = require('gulp-sass');

var scssPath = './ui/**/*.scss';

gulp.task('compile-sass', function () {
    console.log('Starting scss compilation...');

    gulp.src(scssPath)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));

    console.log('Compilation complete.');
});

gulp.task('default', ['compile-sass'], function () {
    console.log('Watching for scss file changes.');

    gulp.watch(scssPath, ['compile-sass']);
});