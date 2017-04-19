exports.config = {
  specs: ['ts_out/src/end_to_end_tests.js'],
  allScriptsTimeout: 11000,
  directConnect: false, // only works with Chrome and Firefox, if using direct, then comment out seleniumAddress
  capabilities: {
    'browserName': 'chrome'
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  //baseUrl: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
