/* eslint max-len: 0 */
import webpack from 'webpack';
import baseConfig from './webpack.config.base';
import autoprefixer from 'autoprefixer'

const config = {
  ...baseConfig,

  debug: true,

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    './src/index'
  ],

  output: {
    ...baseConfig.output,
    publicPath: 'http://localhost:3000/dist/'
  },

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test:   /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  postcss: () => {
    return [autoprefixer];
  },

  target: 'electron-renderer'
};

export default config;
