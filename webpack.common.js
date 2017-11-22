const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		editor: path.resolve(__dirname, 'src/editor.js')
	},
	module: {
		rules: [{
			test: /(\.js)$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		},{
			test: /\.scss$/,
			use: [{
				loader: "style-loader"
			},{
				loader: "css-loader"
			},{
				loader: "sass-loader"
			}]
		}]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'oh editor!'
		})
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};