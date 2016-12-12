import async from 'async'
import { EventEmitter } from 'events'
import DependencyDownloader from '../../services/dependency-downloader'
import InstallConnector from '../../services/install-connector'


class InstallerMaster extends EventEmitter {
  constructor() {
    super()
    this.shouldStop = false
  }

  emitDebug = (debug, isError) => {
    this.emit('debug', debug, isError)
  }

  downloadDeps = (config, done) => {
    if (this.shouldStop) {
      return done()
    }
    new DependencyDownloader({ emitDebug: this.emitDebug, config })
      .downloadAll((error) => {
        if (error) {
          return done(error)
        }
        done()
      })
  }

  installConnector = (config, done) => {
    if (this.shouldStop) {
      return done()
    }
    new InstallConnector({ emitDebug: this.emitDebug, config })
      .install((error) => {
        if (error) {
          return done(error)
        }
        done()
      })
  }

  start(config) {
    async.series([
      async.apply(this.downloadDeps, config),
      async.apply(this.installConnector, config),
    ], (error) => {
      if (error) {
        this.emit('error', error)
        return
      }
      this.emit('done')
    })
  }

  stop() {
    this.shouldStop = true
  }
}

export default InstallerMaster
