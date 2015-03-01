'use strict';

var gulp = require('gulp'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    watch = require('gulp-watch'),
    bower = require('gulp-bower'),
    rimraf = require('rimraf'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    jscs = require('gulp-jscs'),
    jshint = require('gulp-jshint'),
    notify = require('gulp-notify'),
    growl = require('gulp-notify-growl'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    processhtml = require('gulp-processhtml'),
    browserSync = require('browser-sync');

var isProd = argv.prod;

var jsFiles = [
    'bower_components/webcomponentsjs/webcomponents.min.js',
    'bower_components/fnc/dist/fnc.min.js',
    'static/js/main.js'
];

var deployFolder = '../deploy';
var growlNotifier = growl();

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components/'))
});


gulp.task('clean', function (cb) {
    rimraf('../deploy', cb);
});


gulp.task('jscs', function() {
    gulp.src('static/js/**/*.js')
        .pipe(jscs('.jscsrc'))
        .pipe(jshint.reporter('fail'))
        .pipe(notify({
            title: 'JSCS',
            message: 'JSCS Passed!',
            notifier: growlNotifier
        }))
});

gulp.task('lint', function() {
    gulp.src('static/js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(notify({
            title: 'JSHint',
            message: 'JSHint Passed!',
            notifier: growlNotifier
        }))
});

gulp.task('process-js', ['jscs', 'lint'], function () {
    gulp.src(jsFiles, {base: './'})
        .pipe(gulpif(isProd, concat('all.min.js')))
        .pipe(gulpif(isProd, uglify({mangle: true, preserveComments: 'some'})))
        .pipe(gulpif(isProd, gulp.dest(deployFolder + '/static/js'), gulp.dest(deployFolder)));
});


gulp.task('process-scss', function () {
    gulp.src('./static/styles/*.scss')
        .pipe(sass({style: 'expanded'}))
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulpif(isProd, rename({suffix: '.min'})))
        .pipe(gulpif(isProd, minifyCss()))
        .pipe(gulp.dest(deployFolder + '/static/css'));
});


gulp.task('process-html', function () {
    gulp.src('./index.html')
        .pipe(gulpif(isProd, processhtml({})))
        .pipe(gulp.dest(deployFolder));
});


gulp.task('deploy-images', function () {
    gulp.src('./controls/**/*', {base: './'})
        .pipe(gulp.dest(deployFolder));
    gulp.src('./static/images/**/*', {base: './'})
        .pipe(gulp.dest(deployFolder));
});


gulp.task('run', function () {
    browserSync({
        server: {
            baseDir: deployFolder
        },
        open: true,
        browser: ['google chrome'],
        files: deployFolder + '/**/*',
        watchOptions: {
            debounceDelay: 2000
        }
    });
});


gulp.task('browser-reload', function () {
    browserSync.reload();
});


gulp.task('watch', function () {
    gulp.watch(jsFiles, ['process-js']);
    gulp.watch('./static/styles/*.scss', ['process-scss']);
    gulp.watch('./index.html', ['process-html']);
    gulp.watch('./controls/**/*', ['deploy']);
    gulp.watch('./static/images/*', ['deploy']);
});


gulp.task('default', function () {
    runSequence(
        'clean',
        'process-js',
        'process-scss',
        'process-html',
        'deploy-images',
        'run',
        'watch'
    );
});
