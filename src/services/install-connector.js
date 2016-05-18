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
      versions,
      legacy,
      legacyTag,
      githubSlug,
      tag,
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
      '--github-slug',
      githubSlug,
      '--tag',
      tag,
    ];
    if (ignitionVersion != null) {
      args.push('--ignition')
      args.push(ignitionVersion)
    }
    if (legacy) {
      args.push('--legacy')
      args.push(legacyTag)
    }
    this.emitDebug(`Installing connector ${connector}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("Connector Install Failure"))
      callback()
    });
  }
}

export default InstallConnector;
