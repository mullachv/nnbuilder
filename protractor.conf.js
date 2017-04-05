exports.config = {
  specs: ['ts_out/src/end_to_end_tests.js'],
  allScriptsTimeout: 11000,
  directConnect: true, // only works with Chrome and Firefox
  capabilities: {
    'browserName': 'chrome'
  },
  baseUrl: 'http://localhost:4444/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
