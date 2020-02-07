const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: './src/index.js',
        peers: './src/peers.js',
        geos: './src/geos.js'
    },
    module: {
        rules: [
            {
                test: /\.json$/,
                type: "javascript/auto",
                use: [
                    'json-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.png$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...['index', 'peers', 'geos'].map((name, index, original) => {
            return new HtmlWebpackPlugin({
                filename: `${name}.html`,
                template: `./src/${name}.html`,
                excludeChunks: original.filter((n) => n !== name)
            })
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};
