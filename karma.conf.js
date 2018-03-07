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
      'test/**/*.html',
      'bower_components/webcomponentsjs/webcomponents-lite.js',
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
        included: true,
        served: true
      },
      {
        pattern: 'test_components/**/*.html',
        included: false,
        served: true
      },
      {
        pattern: 'test/**/*.js',
        included: true,
        served: true
      },

    ],

    preprocessors: {
      '**/*.html': ['html2js'],
      'src/**/*.js': ['coverage'],
    },
    html2JsPreprocessor: {
      processPath: function (filePath) {
        return filePath.replace('test/domHandler/fixture/', '').replace(/\.html$/, '');
      }
    },

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true,
    proxies: {
      '/node_modules/': '/base/node_modules',
      '/bower_components/': '/base/bower_components',
      '/specs/': '/base/specs',
      '/src/': '/base/src/',
      '/test_components': '/base/test_components'
    },
    concurrency: Infinity
  });
};