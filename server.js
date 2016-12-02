/* eslint no-console: 0 */

require('babel-polyfill')
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import config from './webpack.config.dev'

const app = express()
const compiler = webpack(config)

const wdm = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: "minimal",
})

app.use(wdm)

compiler.run((error, stats) => {
  if (error) {
    console.error(error.stack)
    process.exit(1)
    return
  }
  console.log(stats.toString("minimal"))
  app.use(webpackHotMiddleware(compiler))
  const server = app.listen(3000, 'localhost', err => {
    if (err) {
      console.error(err)
      process.exit(1)
      return
    }
    console.log(`Listening at http://localhost:3000`)
  })
  process.on('SIGTERM', () => {
    console.log('Stopping dev server')
    wdm.close()
    server.close(() => {
      process.exit(0)
    })
  })
})
