let webpack = require('webpack');
let path = require('path');

let parentDir = __dirname;

module.exports = {
    mode: 'development',
    entry: [
        path.join(parentDir, 'src/index.js')
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },{
            test: /\.less$/,
            loaders: ["style-loader", "css-loader", "less-loader"]
        }
        ]
    },
    output: {
        path: parentDir + '/public',
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: parentDir,
        historyApiFallback: true
    },
    devtool: 'source-map'
};