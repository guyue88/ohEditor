module.exports = {
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
		}, {
		    test: /\.(woff2?|svg|eot|ttf|otf)(\?.*)?$/,
		    use: [{
		        loader: 'file-loader',
		        options: {
		            limit: 12000,
		            name: '[name]_[hash:6].[ext]'
		        }
		    }]
		}]
<<<<<<< HEAD
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
=======
>>>>>>> dev
	}
};