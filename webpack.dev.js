/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackConfigCommon = require('./webpack.common');

const { NODE_ENV } = process.env;

module.exports = merge(
  webpackConfigCommon,
  {
    entry: path.resolve(__dirname, './src/App'),
    output: {
      filename: 'bundle.js',
      chunkFilename: '[id].[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
        hash: false,
        NODE_ENV,
      }),
    ],
    module: {
      rules: [
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
          test: /\.(sa|sc)ss$/,
          use: [
            'style-loader',
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
  },
);
