const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');


const extractLess = new ExtractTextPlugin({
    filename: "css/[name].css",
    disable: process.env.NODE_ENV === "development"
});

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    entry: {
        index: resolve('src') + '/index.js',
        // common: resolve(src) + '/common.js',
    },
    output: {
        filename: 'js/[name].js',
        path: resolve('public')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'modules': resolve('node_modules')
        }
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(['public']),
        new HtmlWebpackPlugin({
            title: 'Docker Registry UI',
            template: resolve('src') + '/index.html',
            inject: 'body',
            filename: 'index.html'
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     beautify: false,
        //     comments: false,
        //     compress: {
        //         warnings: false,
        //         // drop_console: true,
        //         collapse_vars: true,
        //         reduce_vars: true,
        //     }
        // }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],
            axios: 'axios'
        }),
        extractLess
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader", options: { minimize: true }
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader", options: { minimize: true }
                    }, {
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader", options: { minimize: true }
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]'
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: "file-loader", options: { outputPath: 'images/' }
                }]
            },
        ]
    }
}
