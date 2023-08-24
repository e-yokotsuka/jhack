'use strict';

const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const ENTRY_PATH_NAME = 'src';
const OUTPUT_PATH_NAME = 'dist';
const PUBLIC_PATH_NAME = 'public';

const env = process.env.NODE_ENV || 'development';
const isEnvProduction = env === 'production';
const isEnvDevelopment = env === 'development';
const outputPath = path.resolve(__dirname, OUTPUT_PATH_NAME);
const entry = path.resolve(__dirname, ENTRY_PATH_NAME, 'index.js');

console.info('---------- info ---------');
console.info(`env: ${env}`);
console.info(`outputPath: ${outputPath}`);
console.info(`entry: ${entry}`);
console.info(`isEnvProduction: ${isEnvProduction}`);
console.info('-------------------------');


module.exports = {
    mode: env,
    devtool: isEnvDevelopment ? 'cheap-module-source-map' : false,
    entry,
    output: {
        path: `${outputPath}`,
        publicPath: '',
        filename: isEnvProduction
            ? 'js/[name].[contenthash:8].js'
            : isEnvDevelopment && 'js/[name].js',
        chunkFilename: isEnvProduction
            ? 'js/[name].[contenthash:8].chunk.js'
            : isEnvDevelopment && 'js/[name].chunk.js',
        assetModuleFilename: 'assets/[name].[hash][ext]',
        clean: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimize: isEnvProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg|json)$/i,
                type: 'asset',
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[folder]/[name].[ext]',
                        outputPath: 'assets',
                        publicPath: `./${PUBLIC_PATH_NAME}/assets`
                    },
                }]
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            }
        ]
    },
    devServer: {
        open: true,
        hot: true,
        watchFiles: ['src/**/*', `${PUBLIC_PATH_NAME}/**/*`]
    },
    plugins: [
        new HtmlWebpackPlugin(
            Object.assign(
                {
                    inject: true,
                    template: `./${PUBLIC_PATH_NAME}/index.html`,
                },
                isEnvProduction ? {
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true,
                    },
                } : {}
            )),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, 'public/assets'),
                to: path.resolve(__dirname, `${OUTPUT_PATH_NAME}/assets`)
            }]
        }),
        new HtmlWebpackHarddiskPlugin(),
        new MiniCssExtractPlugin({ filename: 'css/app.css' }),
        new ESLintPlugin({
            extensions: ['js'],
            exclude: 'node_modules',
            eslintPath: require.resolve('eslint'),
            failOnError: !(isEnvDevelopment),
            failOnWarning: false,
            emitWarning: false,
            cache: true,
            resolvePluginsRelativeTo: __dirname,
        }),
    ],
    performance: false,
};