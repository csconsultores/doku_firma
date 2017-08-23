const webpack = require('webpack')
module.exports = {
	entry: __dirname + "/src/index.js",
	output:{
		 path:  __dirname + "/public",
         filename: 'bundle.js',
	},
	devServer:{
		inline:true,
		contentBase:"./public",
		port:3000
	},

	module:{
		loaders: [
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader:'babel-loader',
				query:{
					presets:['latest', 'stage-0', 'react']
				}
			},
			{
				test:/\.json$/,
				exclude:/node_modules/,
				loader:'json-loader'
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			}
		]
	}
}