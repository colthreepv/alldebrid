'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

// webpack is silly and doesn't tell you what is the name of your hashed bundles
function webpackHashInfo () {
  this.plugin('done', function (statsData) {
    const stats = statsData.toJson();
    if (stats.errors.length) return;

    fs.writeFileSync(path.join(__dirname, 'build', '.bundles.json'), JSON.stringify(stats.assetsByChunkName));
  });
}

const plugins = [
  // outputs a chunk for all the javascript libraries: angular & co
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js'
  }),
  // outputs a chunk for common css: bootstrap, mostly
  new webpack.optimize.CommonsChunkPlugin({
    name: 'style',
    chunks: ['style'],
    minChunks: Infinity,
    filename: isProd ? '[name]-[chunkhash].css' : '[name].css'
  }),
  // handy to enable/disable development features in the client-side code
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${env}"`
  }),
  /**
   * extracts all the css code and puts it in the respective file
   * this produces:
   * - style.css: generic CSS used across all applications
   * - login.css: specific CSS used in login
   * - main.css:  specific CSS used in main
   */
  new ExtractTextPlugin(isProd ? '[name]-[chunkhash].css' : '[name].css')
];

if (isProd) { // add plugins in case we're in production
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }));

  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    },
    sourceMap: false // maybe put sourcemap also in production?
  }));
  plugins.push(webpackHashInfo);
  plugins.push(new CleanWebpackPlugin(['build']));
} else {
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: false,
    debug: true
  }));
}

const browserLibs = [
  'angular'
];

module.exports = {
  devtool: '#module-inline-source-map',
  entry: {
    main: path.join(__dirname, 'client/apps/', 'main'),
    login: path.join(__dirname, 'client/apps/', 'login'),
    style: path.join(__dirname, 'css', 'index.scss'),
    vendor: browserLibs
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      { test: /.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', isProd ? 'css!sass' : 'css?sourceMap!sass?sourceMap') }
    ]
  },
  plugins,
  sassLoader: {
    includePaths: [path.join(__dirname, 'node_modules')]
  },

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    stats: 'minimal',

    // Open resources on the backend server while developing
    // Reference: http://webpack.github.io/docs/webpack-dev-server.html#proxy
    proxy: {
      '/': {
        target: 'http://localhost:8000'
      }
    }
  }
};
