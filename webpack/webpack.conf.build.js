var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackCommonConfig = require('./webpack.conf.common');

module.exports = Object.assign({}, webpackCommonConfig, {
  devtool: 'source-map',
  entry: {
    'bundle.js': './src/index',
    'styles.js': './src/styles/index.less',
  },
  module: Object.assign({}, webpackCommonConfig.module, {
    loaders: [
      {
        test: /\.(jsx|es6)$/,
        loaders: ['babel'],
      },
      // Extract styles to text for builds.
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          "style-loader", "css-loader!less-loader")
      },
    ]
  }),
  plugins: webpackCommonConfig.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': webpackCommonConfig.envVars,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    // Extract styles to text for builds.
    new ExtractTextPlugin("styles.css"),
  ]),
});
