/* eslint max-len: 0 */
import path from 'path'
import webpack from 'webpack'
import baseConfig from './webpack.config.base'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'

const config = {
  ...baseConfig,

  debug: true,

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    'babel-polyfill',
    path.join(__dirname, 'src', 'index'),
  ],

  output: {
    ...baseConfig.output,
    publicPath: 'http://localhost:3000/',
  },

  module: {
    ...baseConfig.module,
    loaders: [
      new HtmlWebpackPlugin(),
      ...baseConfig.module.loaders,
      {
        test: /\.css$/,
        loader: 'css-loader!postcss-loader'
      },
    ],
  },

  plugins: [
    ...baseConfig.plugins,
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'app.html',
      template: path.join(__dirname, 'src', 'app.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],

  postcss: () => {
    return [autoprefixer]
  },

  target: 'electron-renderer',
}

export default config
