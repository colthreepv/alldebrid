'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

const pluginList = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js'
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${env}"`
  }),
  new ExtractTextPlugin(isProd ? '[name]-[chunkhash].css' : '[name].css')
];

if (isProd) { // add plugins in case we're in production
  pluginList.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }));

  pluginList.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    },
    sourceMap: false // maybe put sourcemap also in production?
  }));
  pluginList.push(webpackHashInfo);
} else {
  pluginList.push(new webpack.LoaderOptionsPlugin({
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
  plugins: pluginList,
  sassLoader: {
    includePaths: [path.join(__dirname, 'node_modules')]
  },

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    contentBase: './build',
    stats: 'minimal',

    // Open resources on the backend server while developing
    // Reference: http://webpack.github.io/docs/webpack-dev-server.html#proxy
    proxy: {
      '/': {
        target: 'http://localhost:3000'
      }
    }
  }
};
