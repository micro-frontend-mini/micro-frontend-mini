/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  target: 'web',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    classnames: 'classNames',
    'prop-types': 'PropTypes',
    'react-router': 'ReactRouter',
    'js-cookie': 'Cookies',
    lodash: '_',
    moment: 'moment',
    axios: 'axios',
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.HASH_SUFFIX': JSON.stringify(new Date().getTime()),
    }),
  ],
  optimization: {
    removeAvailableModules: false, // 官方建议，提升构建性能，v4 默认打开，v5 默认禁用，所以这里改为禁用
    splitChunks: {
      /**
       * 这里只能用 async，而不能用 all，否则会导致主项目报错，目测原因是对所有文件分包会导致入口文件不完整
       * 然后主项目中会无法正确拿到入口对象
       */
      // chunks: 'all',
      chunks: 'async',
    },
  },
  devServer: {
    hot: true,
    port: 80,
    allowedHosts: [
      'localhost',
    ],
    disableHostCheck: true,
    contentBase: './dist',
    host: 'localhost',
  },
};
