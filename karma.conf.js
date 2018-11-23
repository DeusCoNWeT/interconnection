var path = require('path');
module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      // Test dependencies
      'test/fixture/fixture.html',
      {
        pattern: 'node_modules/**',
        included: false,
        served: true
      },
      {
        pattern: 'bower_components/**',
        included: false,
        served: true,
        watched: true
      },
      {
        pattern: 'src/**',
        included: false,
        served: true
      },
      {
        pattern: 'test_components/**/*.html',
        included: false,
        served: true
      },
      // IMPORTANT: loader.js inject html before testing
      'test/loader.js',
      'test/specs/*.js'

    ],

    preprocessors: {
      'test/fixture/*.html': ['html2js'],
      'src/**/*.js': ['coverage'],
    },
    html2JsPreprocessor: {
      processPath: function (filePath) {
        return filePath.replace('test/fixture/', '').replace(/\.html$/, '');
      }
    },

    reporters: ['summary', 'coverage'],
    summaryReporter: {
      // 'failed', 'skipped' or 'all'
      show: 'all',
      // Limit the spec label to this length
      specLength: 100,
      // Show an 'all' column as a summary
      overviewColumn: true
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {
          type: 'html'
        },
        {
          type: 'text'
        },
        {
          type: function () {
            var shieldBadgeReporter = require('istanbul-reporter-shield-badge');
            var istanbul = require('istanbul');
            istanbul.Report.register(shieldBadgeReporter);
            return 'shield-badge';
          }(),
          subdir: '.',
          coverageType: 'statements',
          range: [75, 90],
          subject: 'Code Coverage',
          readmeFilename: 'README.md',
          readmeDir: path.resolve(__dirname) // i.e. if karma.conf.js is located in test/unit from the root folder of your project
        }
      ]
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,
    customLaunchers: {
      'ChromeHeadless': {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
          '--no-sandbox'
        ],
        // debug: true
      },
      'FirefoxHeadless': {
        base: 'Firefox',
        flags: [
          '-headless'
        ]
      },
      'OperaSandbox':{
        base: 'Opera',
        flags: [
          '--no-sandbox'
        ]
      }
    },
    // browsers: ['ChromeHeadless','FirefoxHeadless'],
    // browsers: ['Chrome'],
    browsers: ['FirefoxHeadless','OperaSandbox', 'ChromeHeadless'],

    singleRun: true,
    proxies: {
      '/node_modules/': {
        target: '/base/node_modules',
        changeOrigin: true
      },
      '/bower_components/': {
        target: '/base/bower_components',
        changeOrigin: true
      },
      '/specs/': {
        target: '/base/test/specs',
        changeOrigin: true
      },
      '/src/': {
        target: '/base/src/',
        changeOrigin: true
      },
      '/test_components/': {
        target: '/base/test_components',
        changeOrigin: true
      }
    },
    concurrency: Infinity
  });
};
