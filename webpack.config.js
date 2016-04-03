'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

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
    filename: isProd ? 'libs-[chunkhash].js' : 'libs.js'
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
    sourceMap: false
  }));
  pluginList.push(webpackHashInfo);
} else {
  pluginList.push(new webpack.LoaderOptionsPlugin({
    minimize: false,
    debug: true
  }));
}

const browserLibs = [
  'classnames',
  'react',
  'react-dom',
  'react-redux',
  'redux',
  'redux-thunk'
];

module.exports = {
  devtool: 'cheap-module-source-map', // not sure it works?
  entry: {
    js: path.join(__dirname, 'src', 'main.js'),
    vendor: browserLibs
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: isProd ? 'bundle-[chunkhash].js' : 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
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
          }
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
  }
};
