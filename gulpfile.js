/* global require */
'use strict';
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var jsdoc = require('gulp-jsdoc3');
var minify = require('gulp-minify');
var ghPages = require('gulp-gh-pages');

var shieldBadgeReporter = require('istanbul-reporter-shield-badge');
var istanbul = require('istanbul');
istanbul.Report.register(shieldBadgeReporter);

// Files used
var files = {
  lint_files: ['src/**/*.js', 'test/**/*.js'],
  doc: ['README.md', 'src/**/*.js']
};



gulp.task('lint', function () {
  return gulp.src(files.lint_files)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('doc', function (cb) {
  gulp.src(files.doc, { read: false })
    .pipe(jsdoc({
      opts: {
        'template': 'node_modules/docdash',
        'destination': 'docs'
      }
    }, cb));
});
var gulp = require('gulp');
var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('compress', function () {
  gulp.src('src/*.js')
    .pipe(minify({
      ext: {
        src: '.js',
        min: '.min.js'
      },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'));
});


gulp.task('ghPages',['doc'], function(){
  return gulp.src('./docs/**/*')
    .pipe(ghPages());
});
