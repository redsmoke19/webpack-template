const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  context: path.resolve(__dirname, '../dev'),
  entry: {
    main: ['./static/js/index.js', './static/styles/styles.scss'],
    vendor: './static/js/vendor.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
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
      { test: /\.pug$/, loader: 'pug-loader' },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          publicPath: '/'
        }
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../dev/static/images/**/*.{jpg,jpeg,png}').replace(/\\/g, '/'),
          to: path.resolve(__dirname, '../dist'),
          // noErrorOnMissing: true
        },
        {
          from: path.resolve(__dirname, '../dev/static/fonts/*').replace(/\\/g, '/'),
          to: path.resolve(__dirname, '../dist'),
          // noErrorOnMissing: true
        },
      ],
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../dev/pug/index.pug'),
      filename: 'index.html',
      // favicon: paths.src + '/images/favicon.png',
      minify: false,
      // inject: false
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/style.min.css',
      chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      formatter: 'table',
    }),
    new PrettierPlugin(),
    new SpriteLoaderPlugin()
  ],
};
