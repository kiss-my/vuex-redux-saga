const webpack = require('webpack');
const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  externals: {
    'redux-saga': {
      root: 'ReduxSaga',
      commonjs: 'redux-saga',
      commonjs2: 'redux-saga',
      amd: 'redux-saga',
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vuex-redux-saga.min.js',
    library: 'VuexReduxSaga',
    libraryTarget: 'umd',
  },
  module: { rules: [ { test: /\.js$/, use: 'babel-loader' } ] },
  plugins: [ new webpack.optimize.UglifyJsPlugin(), new UnminifiedWebpackPlugin() ],
  devtool: 'source-map',
};
