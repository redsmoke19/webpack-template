const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '../dev'),
  entry: {
    main: ['../dev/static/js/index.js', '../dev/static/styles/styles.scss'],
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
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: './static/fonts/[name].[ext]',
        },
      },
      { test: /\.js$/, use: ['babel-loader'] },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '../dev/index.html'),
      filename: 'index.html',
      // favicon: paths.src + '/images/favicon.png',
      minify: true,
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      formatter: 'table',
    }),
    // new ImageMinimizerPlugin({
    //   minimizerOptions: {
    //     plugins: [
    //       ['pngquant', { quality: [0.6, 0.7] }],
    //       ['mozjpeg', { quality: 80 }],
    //     ],
    //   },
    // }),
    new PrettierPlugin(),
  ],
};
