import Execute from './execute';

class InstallConnector {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug;
    this.config = config;
    this.execute = new Execute({ emitDebug })
  }

  install(callback) {
    const {
      key,
      binPath,
      connector,
    } = this.config;
    const { installer } = this.config.coreDependencies;
    const executable = this.execute.getFile(installer.fileName);
    let serviceType = 'Service'
    if (process.platform == 'darwin') {
      serviceType = 'UserService'
    }
    const args = [
      '--one-time-password',
      key,
      '--service-type',
      serviceType,
    ];
    this.emitDebug(`Installing connector ${connector}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if (error) return callback(new Error('Connector Install Failure'))
      callback()
    });
  }
}

export default InstallConnector;
