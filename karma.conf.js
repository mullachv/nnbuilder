// Karma configuration
// Generated on Sat Mar 04 2017 23:40:21 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.js',
      'https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.3/angular-material.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-messages.min.js',
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/svg-assets-cache.js',
      'https://code.angularjs.org/1.5.5/angular-sanitize.js',
      'https://code.angularjs.org/1.5.5/angular-resource.js',

      'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-touch.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-mocks.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-route.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js',

      'ts_out/src/common.js',
      'ts_out/src/builder_test.js',
      'ts_out/src/net_test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'ts_out/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // client: {
    //   captureConsole: true
    // }

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
          ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
