var express = require('express');
var path = require('path');
var proxy = require('http-proxy').createProxyServer();
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var url = require('url');

var webpackCommonConfig = require('./webpack/webpack.conf.common');

var devServer = express();

// Setup webpack dev server for each environment.
var environments = ['sandbox'];
for (var i = 0; i < environments.length; i++) {
  var env = environments[i];
  var envPrefix = '/' + env + '/';

  var envWebpackConfig = Object.assign({}, webpackCommonConfig, {
    devtool: 'eval-source-map',
    entry: {
      'bundle.js': [
        './src/index', 
        'webpack-hot-middleware/client?path=' + envPrefix+ '__webpack_hmr',
      ],
    },
    plugins: webpackCommonConfig.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': Object.assign({}, webpackCommonConfig.envVars, {
          'DATA_ENV': JSON.stringify(env),
        }),
      }),
    ]),
  });

  var compiler = webpack(envWebpackConfig);

  devServer.use(envPrefix, webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: envWebpackConfig.output.publicPath,
  }));

  devServer.use(envPrefix, webpackHotMiddleware(compiler));
}

// Setup proxying.
var PROXY_PREFIX = '/proxy/';
devServer.use(PROXY_PREFIX, function(req, res) {
  var targetURL = req.originalUrl.replace(PROXY_PREFIX, '');
  var targetURLParts = url.parse(targetURL, true);
  var proxyTarget = targetURLParts.protocol + '//' + targetURLParts.host;
  req.url = targetURLParts.path;
  proxy.web(req, res, {
    target: proxyTarget
  }, function(e) {
    console.warn("proxy error: ", e); 
  });
});

devServer.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:3000');
});
