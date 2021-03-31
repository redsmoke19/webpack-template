const path = require('path'); // Встроенный модуль в NodeJS под названием path, управляет именами файлов и дирикторий
const HTMLWebpackPlugin = require('html-webpack-plugin'); // Подключаем плагин для WebPack который взаимодействует с HTML
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Чиститу папку Dist перед сборкой
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Плагин для простого копирования файлов
const MiniCSSExtrackPlugin = require('mini-css-extract-plugin'); // Плагин для CSS что бы сам CSS был отвельным файлом
const OptimizedCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // Этот и следующий плагин нужны для минификации CSS
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('IS DEV: ', isDev);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all', // Это если в несколько entry файлов подключены одни и те же библиотеки то они соберутся в один файл
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizedCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const fileName = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loader = [MiniCSSExtrackPlugin.loader, 'css-loader'];

  if (extra) {
    loader.push(extra);
  }
  return loader;
};

module.exports = {
  context: path.resolve(__dirname, 'dev'),
  mode: 'development',
  // Entry это объект и она может содержать несколько точек входа
  entry: {
    main: ['@babel/polyfill', './static/js/index.js'],
    analytics: './static/js/analytics.js',
  },
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.css'], // Это нужно для того, что бы в конце файлов не писать разширение файлов а просто написать "@static/style/style"
    alias: {
      '@': path.resolve(__dirname, 'dev'), // Это что бы не писать относительные пути к файлу, а просто написать "@/static/images"
    },
  },
  optimization: optimization(),
  devServer: {
    port: 3030,
    open: true,
    hot: isDev,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'dev/static/images/*'),
          to: path.resolve(__dirname, 'dist/static/images/content'),
          noErrorOnMissing: true
        },
      ],
    }),
    new MiniCSSExtrackPlugin({
      filename: fileName('css'),
    }),
  ],
  // Webpack идет справа на лево
  // Loader это возможность добавление в функционал WebPack работу с другими типами файлов, к примеру CSS
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.scss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/, // Это нужно для того что бы WebPack умел работать с фалами картинок
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/, // Это нужно для того что бы WebPack умел работать со шрифтами
        use: ['file-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
};
