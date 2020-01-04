const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new webpack.ProvidePlugin({
            env: '../env-dev.js'
        })
    ]
});
