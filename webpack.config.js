'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
  })
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

  // Copy assets from the public folder
  // Reference: https://github.com/kevlened/copy-webpack-plugin
  pluginList.push(new CopyWebpackPlugin([{
    from: path.join(__dirname, 'public'),
    to: path.join(__dirname, 'build')
  }]));
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
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          'postcss'
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
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
