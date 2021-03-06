var webpack = require('webpack');

var webpackCommonConfig = require('../webpack/webpack.conf.common');


function makeDefaultConfig (karmaConfig) {
  return {
    files : [
      '../node_modules/babel-polyfill/dist/polyfill.js',
      './karma-entry-point.js',
    ],
    singleRun: true,
    frameworks: ['jasmine'],
    preprocessors: {
      './karma-entry-point.js': ['webpack', 'sourcemap']
    },
    reporters: ['jasmine-diff', 'dots'],
    logLevel: karmaConfig.LOG_ERROR,
    browsers: ['PhantomJS'],
    webpack: Object.assign({}, webpackCommonConfig, {
      devtool: 'inline-source-map',
      plugins: webpackCommonConfig.plugins.concat([
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('development')
          }
        })
      ])
    }),
    webpackMiddleware : {
      noInfo : true
    },
    plugins: [
      require('karma-coverage'),
      require('karma-jasmine'),
      require('karma-jasmine-diff-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-spec-reporter'),
      require('karma-webpack'),
    ]
  };
}

module.exports = (karmaConfig) => karmaConfig.set(
  makeDefaultConfig(karmaConfig));
