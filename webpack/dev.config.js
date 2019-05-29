const path = require('path');
const merge = require('webpack-merge');
const common = require('./common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      template: path.resolve(__dirname, '../example/editor/index.html'),
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../example/editor/'),
    compress: true,
    hot: true,
    historyApiFallback: {
      disableDotRule: true
    },
    watchOptions: {
      ignored: /node_modules/
    }
  }
});