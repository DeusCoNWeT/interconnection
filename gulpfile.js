/* global require */
'use strict';
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var istanbulReport = require('gulp-istanbul-report');
var eslint = require('gulp-eslint');
var jsdoc = require('gulp-jsdoc3');

// Files used
var files = {
  source: ['src/**/*.js'],
  test: ['test/**/*.html'],
  testOutput: 'test_output/',
  coverage_folder: 'coverage/',
  lint_files: ['src/**/*.js', 'test/**/*.js'],
  doc: ['README.md', 'src/**/*.js']
};

files.coverage_file = files.coverage_folder + 'coverage.json';

// Config istanbul (coverage)
gulp.task('instrument', function () {
  return gulp.src(files.source)
    // Covering files
    .pipe(istanbul({
      coverageVariable: '__coverage__'
    }))
    // instrumented files will go here
    .pipe(gulp.dest(files.coverage_folder))
    .pipe(istanbul.hookRequire());
});
gulp.task('test', ['instrument', 'sourceCode'], function () {
  return gulp
    // Select test files
    .src(files.test, { read: false })
    // Execute mocha test in virtual dom
    .pipe(mochaPhantomJS({
      reporter: ['spec'],
      phantomjs: {
        useColors: true,
        hooks: 'mocha-phantomjs-istanbul',
        coverageFile: files.coverage_file
      }
    }))
    // Print coverage report
    .on('finish', function () {
      gulp.src(files.coverage_file)
        .pipe(istanbulReport({
          reporters: ['text', 'html']
        }));
    });
});

gulp.task('lint', function () {
  return gulp.src(files.lint_files)
    .pipe(eslint({ fix: true }))
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
