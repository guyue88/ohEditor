const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./common.config.js');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
    new CleanWebpackPlugin(),
		new UglifyJSPlugin()
	]
});