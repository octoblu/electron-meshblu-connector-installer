import async from 'async';
import path from 'path';
import Execute from './execute';

class ExecuteThings {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug;
    this.config = config;
    this.execute = new Execute({ emitDebug })
  }

  installDeps(callback) {
    const { deps } = this.config;
    const tasks = _.map(deps, (tag, type) => {
      return async.apply(this.installSingleDep, {type, tag});
    });
    async.series(tasks, callback);
  }

  installSingleDep = ({type, tag}, callback) => {
    if(!this.shouldInstallDep(type)) {
      return callback();
    }
    const { binPath, } = this.config;
    const executable = this.getExecutable('meshblu-connector-dependency-manager');
    const args = [
      '--type',
      type,
      '--tag',
      tag
    ];
    this.emitDebug(`Installing ${type} ${tag}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error(`${type} ${tag} install failure`))
      callback()
    });
  }

  installConnector(callback) {
    const { binPath, uuid, token, connector, downloadURI } = this.config;
    const executable = this.getExecutable('meshblu-connector-assembler');
    const args = [
      '--connector',
      connector,
      '--uuid',
      uuid,
      '--token',
      token,
      '--download-uri',
      downloadURI,
      this.getLegacyArg()
    ];
    this.emitDebug(`Installing connector ${connector}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("Connector Install Failure"))
      callback()
    });
  }

  shouldInstallDep(type) {
    const { platform } = process;
    if(type === "nssm" && platform === "win32") {
      return true
    }
    if(type === "npm" && platform === "win32") {
      return true
    }
    return false
  }

  getExecutable(filename) {
    let ext = '';
    if (process.platform === 'win32') {
      ext = '.exe';
    }
    return `.${path.sep}${filename}${ext}`;
  }

  getLegacyArg() {
    const legacy = this.config;
    if (legacy === true) {
      return '--legacy';
    }
    return '';
  }
}

export default ExecuteThings;
