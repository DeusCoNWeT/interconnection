var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var istanbulReport = require('gulp-istanbul-report');


gulp.task('pre-test', function () {
  return gulp.src('src/*.js')
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
	return gulp
		.src('test/domHandler/fixture/**/*.html', {read: false})
		.pipe(mochaPhantomJS(
			{
				reporter: "spec",
				phantomjs: {
					useColors: true,
					hooks: 'mocha-phantomjs-istanbul',
					coverageFile: 'coverage/coverage.json'
				}
      }))
		// .on('finish', function () {
		// 	gulp.src("./coverage/coverage.json")
    //     .pipe(istanbul.writeReports())
    //     .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}))
		// });
});
