/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
'use strict'

require('babel-polyfill')
const _           = require('lodash')
const os          = require('os')
const rimraf      = require('rimraf')
const async       = require('async')
const path        = require('path')
const webpack     = require('webpack')
const argv        = require('minimist')(process.argv.slice(2))
const packager    = require('electron-packager')
const electronCfg = require('./webpack.config.electron.js').default
const cfg         = require('./webpack.config.production.js').default
const pkg         = require('./package.json')
const deps        = _.keys(pkg.dependencies)
const devDeps     = _.keys(pkg.devDependencies)

const appName = argv.name || argv.n || pkg.productName
const shouldUseAsar = argv.asar || argv.a || false
const shouldBuildAll = argv.all || false
const buildPlatform = argv.platform || false
const buildArch = argv.arch || false

let ignorePaths = [
  '/test($|/)',
  '/release($|/)',
  '/deploy($|/)',
  '/main.development.js',
]

ignorePaths = _.union(ignorePaths, _.map(devDeps, name => `/node_modules/${name}($|/)`))
const filteredDeps = _.filter(deps, name => _.includes(electronCfg.externals, name))
ignorePaths = _.union(ignorePaths, _.map(filteredDeps, name => `/node_modules/${name}($|/)`))

const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  'app-bundle-id': pkg.appBundleId,
  'app-version': pkg.version,
  out: 'release',
  ignore: ignorePaths,
}

const icon = argv.icon || argv.i || 'src/app'

if (icon) {
  DEFAULT_OPTS.icon = icon
}

const version = argv.version || argv.v

console.log('initializing...')

DEFAULT_OPTS.version = version || require('electron/package.json').version

startPack((error) => {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  console.log("Done!")
})

function startBuild(callback) {
  const archs = ['ia32', 'x64']
  const platforms = ['linux', 'win32', 'darwin']
  if (shouldBuildAll) {
    console.log('build all', platforms, archs)
    async.each(platforms, (plat, done) => {
      async.each(archs, async.apply(pack, plat), done)
    }, callback)
    return
  }
  if (buildArch && buildPlatform) {
    console.log('build specific', buildPlatform, buildArch)
    pack(buildPlatform, buildArch, callback)
    return
  }
  if (buildPlatform) {
    console.log('build all for platform', buildPlatform, archs)
    async.each(archs, async.apply(pack, buildPlatform), callback)
    return
  }
  console.log('build current', os.platform(), os.arch())
  pack(os.platform(), os.arch(), callback)
}

function startPack(callback) {
  console.log('start pack...')
  console.log('building electron config')
  webpack(electronCfg, (error, stats) => {
    if(error) {
      return callback(error)
    }
    console.log(stats.toString("minimal"))
    webpack(cfg, (error, stats) => {
      if(error) {
        return callback(error)
      }
      console.log('building production config')
      console.log(stats.toString("minimal"))
      rimraf(path.join(__dirname, 'release'), (error) => {
        if(error) {
          return callback(error)
        }
        startBuild(callback)
      })
    })
  })
}

function pack(platform, arch, cb) {
  // there is no darwin ia32 electron
  if (platform === 'darwin' && arch === 'ia32') return cb()

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png'
      if (platform === 'darwin') {
        extension = '.icns'
      } else if (platform === 'win32') {
        extension = '.ico'
      }
      return extension
    })(),
  }

  const opts = _.assign({}, DEFAULT_OPTS, iconObj, {
    platform,
    arch,
  })
  console.log(`packaging v${pkg.version} for ${platform}-${arch} to ./${opts.out}`)
  packager(opts, cb)
}
