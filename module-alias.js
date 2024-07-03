const path = require('path');

module.exports = {
  '@services': path.join(__dirname, 'dist/services'),
  '@utils': path.join(__dirname, 'dist/utils'),
  '@types': path.join(__dirname, 'dist/types'),
  '@tests': path.join(__dirname, 'dist/tests'),
  '@logs': path.join(__dirname, 'dist/logs'),
};