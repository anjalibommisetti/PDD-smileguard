const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude test-results, selenium_tests, and other temporary files from watch and resolution
config.resolver.blockList = [
  /test-results\/.*/,
  /selenium_tests\/.*/,
  /\.git\/.*/,
  /auth\.json/
];

module.exports = config;
