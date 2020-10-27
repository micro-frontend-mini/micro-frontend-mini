/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfigCommon = require('./webpack.common');

module.exports = merge(
  webpackConfigCommon,
  {
    entry: path.resolve(__dirname, './src/index'),
    output: {
      filename: 'root-config.js',
      path: path.resolve(__dirname, 'lib'),
    },
    mode: 'production',
    devtool: 'none',
    plugins: [
      new CleanWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /.(js|jsx|css)$/, // css 解决IE8下CSS的相关loader报错问题
          enforce: 'post', // post-loader处理
          use: [
            'es3ify-loader',
          ],
        },
        {
          test: /.(js|jsx)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env']],
              plugins: [
                ['@babel/plugin-transform-modules-commonjs'],
                ['@babel/plugin-transform-object-assign'],
              ],
            },
          },
        },
        {
          test: /\.(sa|sc|le)ss$/,
          use: [
            // 'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                import: false,
                modules: {
                  mode: 'local',
                  exportGlobals: true,
                  localIdentName: '[local]-[hash:base64:5]',
                  context: path.resolve(__dirname, 'src'),
                },
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(css)$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|gif|svg|jpg)$/,
          use: [
            'file-loader',
          ],
        },
      ],
    },
    devServer: {
      // host: '172.16.58.54',
    },
  },
);
