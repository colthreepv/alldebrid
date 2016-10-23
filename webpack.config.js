'use strict';
const path = require('path');
const fs = require('fs');
const git = require('git-rev-sync');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

// webpack is silly and doesn't tell you what is the name of your hashed bundles
function webpackHashInfo () {
  this.plugin('done', function (statsData) {
    const stats = statsData.toJson({
      exclude: [/node_modules/]
    });
    if (stats.errors.length) return;

    const assets = stats.assets.map(asset => asset.name)
      .filter(entry => /(\.js|\.css)$/.test(entry))
      .reduce((hash, current) => {
        if (current.endsWith('.css')) hash.css[current.split('-')[0]] = current;
        if (current.endsWith('.js')) hash.js[current.split('-')[0]] = current;
        return hash;
      }, { js: {}, css: {} });
    /**
     * produces:
     * {
     *   main: 'main-a2bd16cfe8109b14b9bd.js',
     *   login: 'login-5265991d0f2abdccc1bd.js'
     * }
     */

    fs.writeFileSync(path.join(__dirname, 'build', '.bundles.json'), JSON.stringify(assets));
  });
}

const extractSASS = new ExtractTextPlugin({ filename: isProd ? '[name]-[chunkhash].css' : 'style-[name].css' });

const plugins = [
  new webpack.LoaderOptionsPlugin({
    options: {
      sassLoader: {
        includePaths: [path.join(__dirname, 'node_modules')]
      },
      context: '/'
    }
  }),
  // outputs a chunk for all the javascript libraries: angular & co
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    chunks: ['main', 'login'],
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js'
  }),
  /**
   * extracts all the css code and puts it in the respective file
   * this produces:
   * - style.css: generic CSS used across all applications
   * - login.css: specific CSS used in login
   * - main.css:  specific CSS used in main
   */
  extractSASS,
  // handy to enable/disable development features in the client-side code
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${env}"`,
    'process.env.GIT_REV': `"${git.short()}"`
  })
];

if (isProd) { // add plugins in case we're in production
  plugins.push(webpackHashInfo);
  plugins.push(new CleanWebpackPlugin(['build']));
}

const browserLibs = [
  'angular',
  'angular-ui-router'
];

module.exports = {
  devtool: isProd ? 'source-map' : 'module-inline-source-map',
  entry: {
    main: path.join(__dirname, 'client/apps/', 'main.js'),
    login: path.join(__dirname, 'client/apps/', 'login.js'),
    // vendor: browserLibs
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      // es6 code
      { test: /.js$/, loader: ['babel?cacheDirectory'], exclude: /node_modules/ },
      // html included from angular
      { test: /.html$/, loader: 'html' },
      // scss - and only scss
      { test: /\.scss$/, loader: extractSASS.extract({ fallbackLoader: 'style', loader: ['css?sourceMap', 'sass?sourceMap'] }) },
      // static assets
      { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'url?limit=30000&name=[name]-[hash].[ext]' }
    ]
  },
  plugins,
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
