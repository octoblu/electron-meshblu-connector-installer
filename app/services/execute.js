import async from 'async'
import path from 'path'
import _ from 'lodash'
import spawn from 'cross-spawn'
import Sudoer from 'electron-sudo'
import { remote } from 'electron'

export default class Execute {
  constructor({ emitDebug, serviceType }) {
    this.emitDebug = emitDebug
    this.serviceType = serviceType
    this.do = this.do.bind(this)
    this.doAndRetry = this.doAndRetry.bind(this)
    this.sudoer = new Sudoer({
      name: 'Meshblu Connector Installer',
      bindir: path.normalize(path.join(remote.getGlobal('appPath'), 'node_modules/electron-sudo/dist/bin')),
    })
  }

  async createSpawn({ executable, args, cwd, env }) {
    let child
    this.emitDebug(`Executing: ${executable} ${args.join(' ')}`)
    if (this.serviceType === 'service') {
      child = await this.sudoer.spawn(executable, args, { cwd, env })
    } else {
      child = spawn(executable, args, { cwd, env })
    }
    return child
  }


  do({ executable, args, cwd }, callback) {
    const env = _.assign(process.env, {
      DEBUG: 'meshblu-connector-*',
    })
    this.createSpawn({ executable, args, cwd, env })
      .then((child) => {
        child.on('error', (error) => {
          this.emitDebug(`${executable} exited with error ${error.message}`, true)
          callback(error)
        })

        child.stdout.on('data', (data) => {
          this.logOutput('stdout', data)
        })

        child.stderr.on('data', (data) => {
          this.logOutput('stderr', data, true)
        })

        child.on('close', (code) => {
          this.emitDebug(`${executable} exited ${code}`, code > 0)
          if (code > 0) {
            return callback(new Error('Error during installation'))
          }
          callback()
        })
        return null
      }).catch(callback)
  }

  doAndRetry({ executable, args, cwd }, callback) {
    const options = { times: 3, interval: 100 }
    async.retry(options, async.apply(this.do, { executable, args, cwd }), callback)
  }

  logOutput(key, ouput, isError) {
    const str = ouput.toString()
    const lines = str.split('\n')
    _.each(lines, (line) => {
      if (line.indexOf(' - ') > -1) {
        const debugLine = _.last(line.split(' - '))
        if (!_.isEmpty(line)) {
          this.emitDebug(`debug: ${debugLine}`, false)
        }
        return
      }
      if (!_.isEmpty(line)) {
        this.emitDebug(`${key}: ${line}`, isError)
      }
    })
  }
}
