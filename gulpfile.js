var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
//var shell = require('gulp-shell');

var outFolder = '.';

// Concat & Minify JS
gulp.task('minify', function(){
    return gulp.src(['json-stat.max.js'])
        .pipe(uglify())
        .pipe(rename('json-stat.js'))
        .pipe(gulp.dest(outFolder));
});

// Watch Our Files
gulp.task('watch', function() {
    gulp.watch('src/json-stat.max.js', ['minify']);
});

// Default
gulp.task('default', ['minify']);