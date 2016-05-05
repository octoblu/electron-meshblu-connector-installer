import {EventEmitter} from 'events'
import InstallerInfo from '../../services/installer-info';
import DependencyDownloader from '../../services/dependency-downloader';
import InstallDependencies from '../../services/install-dependencies';
import InstallConnector from '../../services/install-connector';
import async from 'async'

class InstallerMaster extends EventEmitter {
  constructor() {
    super()
  }

  emitDebug = (debug) => {
    this.emit('debug', debug)
  }

  getInfo = (done) => {
    this.emit('step', 'Getting installer information');
    new InstallerInfo({emitDebug: this.emitDebug})
      .getInfo((error, config) => {
        if(error) return this.emit('error', error);
        this.config = config;
        this.emit('config', config);
        this.emitDebug(`Got key ${config.key}`)
        done()
      });
  }

  downloadDeps = (done) => {
    this.emit('step', 'Downloading dependencies');
    new DependencyDownloader({emitDebug: this.emitDebug, config: this.config})
      .downloadAll((error) => {
        if(error) return this.emit('error', error);
        done()
      });
  }

  installDeps = (done) => {
    this.emit('step', 'Installing dependencies');
    new InstallDependencies({emitDebug: this.emitDebug, config: this.config})
      .install((error) => {
        if(error) return this.emit('error', error);
        done()
      });
  }

  installConnector = (done) => {
    this.emit('step', 'Installing Connector')
    new InstallConnector({emitDebug: this.emitDebug, config: this.config})
      .install((error) => {
        if(error) return this.emit('error', error);
        done()
      });
  }

  start(done) {
    async.series([
      this.getInfo,
      this.downloadDeps,
      this.installDeps,
      this.installConnector
    ], (error) => {
      if(error) return this.emit('error', error)
      done()
    })
  }
}

export default InstallerMaster
