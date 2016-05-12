import path from 'path';
import Execute from './execute';

class InstallConnector {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug;
    this.config = config;
    this.execute = new Execute({ emitDebug })
  }

  install(callback) {
    const {
      binPath,
      uuid,
      token,
      connector,
      downloadURI,
      versions,
      legacy,
    } = this.config;
    const { ignitionVersion } = versions;
    const { assembler } = this.config.coreDependencies;
    const executable = this.execute.getFile(assembler.fileName);
    let args = [
      '--connector',
      connector,
      '--uuid',
      uuid,
      '--token',
      token,
      '--download-uri',
      downloadURI
    ];
    if (ignitionVersion != null) {
      args.push('--ignition')
      args.push(ignitionVersion)
    }
    if (legacy) {
      args.push('--legacy')
    }
    this.emitDebug(`Installing connector ${connector}`)
    let method = 'do'
    if (process.platform !== "darwin") {
      method = 'doSudo'
    }
    this.execute[method]({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("Connector Install Failure"))
      callback()
    });
  }
}

export default InstallConnector;
