module.exports = function () {
  return {
    files: [
      'lib/**/*.js',
      'test/**/*',
      { pattern: 'test/**/*spec.js', ignore: true }
    ],

    tests: [
      'test/**/*spec.js'
    ],

    setup: function () {
      // global.expect = require('chai').expect;
    },

    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'mocha'
  };
};
