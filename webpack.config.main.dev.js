/**
 * Created by Raaw on 5/9/2017.
 */
/**
 * Base webpack config used across other specific configs
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ElectronPlugin = require("electron-webpack-plugin");
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';

module.exports = {
  target: 'electron-renderer',
  devtool: "source-map",
  entry: path.join(__dirname, 'app/main.dev.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build/electron'),
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      'node_modules',
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
  ]
};
