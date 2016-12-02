import path from 'path'

export default {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src')
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          attrs: ['link:href'],
        }
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: /\/favicon.ico$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules')
        ],
        loader: 'file',
        query: {
          name: '/files/[name].[ext]'
        }
      }
    ],
    noParse: /validate\.js/,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [

  ],
  externals: [
    'is-admin',
    'cross-spawn'
  ],
}
