const path = require('path');
const args = require('yargs').argv;
// const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const PostCssFlexbugs = require('postcss-flexbugs-fixes');
const Pkg = require('./package');
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const CONF = require('./conf');

const IS_DEV = (process.env.NODE_ENV === 'dev');

/**
 * Webpack Configuration
 */

module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      // JS
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        loader: ['webpack-extract-css-hot-reload'].concat(ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: !IS_DEV,
              sourceMap: IS_DEV,
              publicPath: '../',
            },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_DEV,
              publicPath: '../',
              plugins: [
                PostCssFlexbugs,
                Autoprefixer({
                  browsers: ['last 3 versions'],
                }),
              ],
            },
          },
        ])),
      },

      // SCSS
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: !IS_DEV,
                sourceMap: IS_DEV,
                publicPath: '../',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: IS_DEV,
                plugins: [
                  PostCssFlexbugs,
                  Autoprefixer({
                    browsers: ['last 3 versions'],
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: IS_DEV,
                data: `$prefix: ${CONF.prefix};`,
              },
            },
          ],
        }),
      },

      // FONTS/IMAGES
      {
        test: /\.(woff|woff2|ttf|eot|otf|svg|gif|png|jpeg|jpg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name(file) {
                if (file.indexOf('fonts') > -1) {
                  return 'fonts/[name].[ext]';
                }

                return 'images/[name].[ext]';
              },
              fallback: 'file-loader',
              outputPath: './',
              publicPath: args.git ? `/${Pkg.name}/` : '/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV,
      CONF: JSON.stringify(CONF),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        charset: 'UTF-8',
      },
    }),
    new ExtractTextPlugin({
      filename: 'styles/[name].css',
    }),
  ],
};
