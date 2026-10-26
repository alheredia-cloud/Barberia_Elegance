module.exports = function(config) {
  config.set({
    // Frameworks to use for testing.
    frameworks: ['jasmine'],

    // Only specify Jasmine Spec reporters.
    reporters: ['kjhtml'],

    // Start these browsers
    browsers: ['ChromeHeadless'],

    // Continuous Integration test runner <https://github.com/Karma-Runner/karma#continuous-integration>.
    singleRun: true,

    // enable browsers to exit after tests are finished
    browserConsoleLogOptions: {
      level: 'log',
      terminal: true
    },

    // Base path to resolve all relative references to.
    basePath: '',

    // Point to the files that should be loaded in the browser
    files: [
      'src/services/storage.service.js',
      'src/tests/storage.test.js'
    ],

    // Preprocess JS files to handle JSX and ESM via Vite
    preprocessors: {
      'src/services/storage.service.js': ['vite'],
      'src/tests/storage.test.js': ['vite']
    },

    // Plugins to use
    plugins: [
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'karma-chrome-launcher',
      'karma-vite'
    ]
  });
};
