import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import baseConfig from './webpack.config.base'
import autoprefixer from 'autoprefixer'

const config = {
  ...baseConfig,

  devtool: 'cheap-source-map',

  entry: [
    'babel-polyfill',
    './src/index'
  ],

  output: {
    ...baseConfig.output,
    publicPath: '/',
  },

  module: {
    ...baseConfig.module,

    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader'),
      },
    ],
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, 'src', 'app.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    })
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('style.css', { allChunks: true }),
  ],
  postcss: () => {
    return [autoprefixer]
  },

  target: 'electron-renderer',
}

export default config
