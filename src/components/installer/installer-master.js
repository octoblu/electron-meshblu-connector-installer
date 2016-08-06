import { EventEmitter } from 'events'
import InstallerInfo from '../../services/installer-info';
import DependencyDownloader from '../../services/dependency-downloader';
import InstallDependencies from '../../services/install-dependencies';
import InstallConnector from '../../services/install-connector';
import { expireOTP } from '../../services/otp-service';

import async from 'async'

class InstallerMaster extends EventEmitter {
  constructor({ key }) {
    super()
    this.key = key
  }

  emitDebug = (debug) => {
    this.emit('debug', debug)
  }

  getInfo = (done) => {
    this.emit('step', 'Getting installer information');
    const key = this.key;
    new InstallerInfo({ emitDebug: this.emitDebug })
      .getInfo({ key }, (error, config) => {
        if (error) return this.emit('error', error);
        this.config = config;
        this.emit('config', config);
        this.emitDebug(`Got key ${config.key}`)
        done()
      });
  }

  downloadDeps = (done) => {
    this.emit('step', 'Downloading dependencies');
    new DependencyDownloader({ emitDebug: this.emitDebug, config: this.config })
      .downloadAll((error) => {
        if (error) return this.emit('error', error);
        done()
      });
  }

  installConnector = (done) => {
    this.emit('step', 'Installing Connector')
    new InstallConnector({ emitDebug: this.emitDebug, config: this.config })
      .install((error) => {
        if (error) return this.emit('error', error);
        done()
      });
  }

  expireOTP = (done) => {
    const { key } = this.config;
    expireOTP({ key }, done);
  }

  start(done) {
    async.series([
      this.getInfo,
      this.downloadDeps,
      this.installConnector,
    ], (error) => {
      if (error) return this.emit('error', error)
      done()
    })
  }
}

export default InstallerMaster
