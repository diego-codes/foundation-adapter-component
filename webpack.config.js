const path = require('path');

module.exports = {
  entry: path.resolve('./js/app.js'),
  output: {
    filename: 'app.processed.js',
    path: path.resolve('./js'),
  },
  module: {
    rules: [
      { test: /\.js/, use: 'babel-loader' },
    ],
  },
};