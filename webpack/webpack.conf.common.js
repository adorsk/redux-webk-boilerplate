var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var srcDir = path.join(__dirname, '..', 'src');

var NODE_ENV = process.env.NODE_ENV || 'development';
var DATA_ENV = process.env.DATA_ENV || 'sandbox';
var BUILD_ENV = process.env.BUILD_ENV || 'devServer';

/*
 * Get git info for environment variables.
 */
var repoDir = path.join(__dirname, '..');
var exec = require('child_process').execSync;
var gitCommitInfoCmd = 'cd ' + repoDir +
  ' && git --no-pager log -n1 --pretty=format:"%h (%ci)"';
var gitCommitInfo = exec(gitCommitInfoCmd).toString();

var gitOriginUrlCmd = 'cd ' + repoDir +
  ' && git config --get remote.origin.url';
var gitOriginUrl = exec(gitOriginUrlCmd).toString();

module.exports = {
  envVars:  {
    'GIT_COMMIT': JSON.stringify(gitCommitInfo),
    'GIT_ORIGIN_URL': JSON.stringify(gitOriginUrl),
    'NODE_ENV': JSON.stringify(NODE_ENV),
    'DATA_ENV': JSON.stringify(DATA_ENV),
    'BUILD_ENV': JSON.stringify(BUILD_ENV),
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|es6)$/,
        loaders: ['babel'],
      },
    ]
  },
  output: {
    path: path.join(__dirname, '..', 'build', DATA_ENV),
    filename: '[name]',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.join(__dirname, '..', 'index.tpl.html'),
      NODE_ENV: NODE_ENV,
      DATA_ENV: DATA_ENV,
      BUILD_ENV: BUILD_ENV,
    }),
  ],
  resolve: {
    alias: {
      src: srcDir,
    },
    extensions: ['', '.js', '.jsx', '.es6']
  }
};
