var gulp = require('gulp');
var gulpSass = require('gulp-sass');

var scssPath = './ui/**/*.scss';

gulp.task('compile-sass', function () {
    console.log('Starting scss compilation...');

    return compileSass();
});

function compileSass() {
    return gulp.src(scssPath)
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
}

gulp.task('default', gulp.series('compile-sass', function () {
    console.log('Watching for scss file changes.');

    gulp.watch(scssPath, compileSass);
}));