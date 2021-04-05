const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');

module.exports = {
  context: path.resolve(__dirname, '../dev'),
  entry: {
    main: ['./static/js/index.js', './static/styles/styles.scss'],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    filename: 'static/js/[name].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.css', '.scss'],
    alias: {
      '@': path.resolve(__dirname, '../dev'),
    },
  },
  module: {
    rules: [
      // {
      //   test: /\.(png|jpg|svg|gif)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[path][name].[ext]',
      //   },
      // },
      // {
      //   test: /\.(eot|ttf|woff|woff2)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[path][name].[ext]',
      //   },
      // },
      { test: /\.js$/, use: ['babel-loader'] },
      { test: /\.pug$/, loader: 'pug-loader' }
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../dev/static/images/**'),
          to: path.resolve(__dirname, '../dist'),
          // noErrorOnMissing: true
        },
        {
          from: path.resolve(__dirname, '../dev/static/fonts/**'),
          to: path.resolve(__dirname, '../dist'),
          // noErrorOnMissing: true
        },
      ],
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../dev//pug/index.pug'),
      filename: 'index.html',
      // favicon: paths.src + '/images/favicon.png',
      minify: false,
    }),
    // new HtmlWebpackPugPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/style.min.css',
      chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      formatter: 'table',
    }),
    new PrettierPlugin(),
  ],
};
