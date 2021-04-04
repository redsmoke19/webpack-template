const path = require('path'); // Встроенный модуль в NodeJS под названием path, управляет именами файлов и дирикторий
const HTMLWebpackPlugin = require('html-webpack-plugin'); // Подключаем плагин для WebPack который взаимодействует с HTML
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Чиститу папку Dist перед сборкой
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Плагин для простого копирования файлов
const MiniCSSExtrackPlugin = require('mini-css-extract-plugin'); // Плагин для CSS что бы сам CSS был отвельным файлом
const OptimizedCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // Этот и следующий плагин нужны для минификации CSS
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// const WriteFilePlugin = require('write-file-webpack-plugin');

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

const fileName = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = extra => {
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
    main: [
      './static/js/index.js',
      './static/styles/styles.scss',
    ],
  },
  output: {
    // filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    filename: 'static/js/main.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.png', '.css', '.scss'], // Это нужно для того, что бы в конце файлов не писать разширение файлов а просто написать "@static/style/style"
    alias: {
      '@': path.resolve(__dirname, 'dev'), // Это что бы не писать относительные пути к файлу, а просто написать "@/static/images"
    },
  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3030,
    open: true,
    hot: isDev,
  },
  // Webpack идет справа на лево
  // Loader это возможность добавление в функционал WebPack работу с другими типами файлов, к примеру CSS
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.scss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/, // Это нужно для того что бы WebPack умел работать с фалами картинок
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: './static/fonts/[name].[ext]',
        },
      },
      // {
      //   test: /\.m?js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env'],
      //       plugins: ['@babel/plugin-proposal-class-properties'],
      //     },
      //   },
      // },
      { test: /\.js$/, use: ['babel-loader'] },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, 'dev/static/images/**'),
    //       to: path.join(__dirname, 'dist'),
    //       // noErrorOnMissing: true
    //     },
    //   ],
    // }),
    new MiniCSSExtrackPlugin({
      // filename: fileName('css'),
      filename: 'static/css/style.min.css'
    }),
    new ESLintPlugin(),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['pngquant', { quality: [0.6, 0.7] }],
          ['mozjpeg', { quality: 80 }],
        ],
      },
    }),
  ],
};
