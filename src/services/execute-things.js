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
      return async.apply(this.installDep, {type, tag});
    });
    async.series(tasks, callback);
  }

  installDep = ({type, tag}, callback) => {
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
    const { binPath, uuid, token, connector, versions } = this.config;
    const { tag } = versions
    const executable = this.getExecutable('meshblu-connector-installer');
    const args = [
      '--connector',
      connector,
      '--uuid',
      uuid,
      '--token',
      token,
      '--tag',
      tag,
      this.getLegacyArg()
    ];
    this.emitDebug(`Installing connector ${connector} ${tag}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("Connector Install Failure"))
      callback()
    });
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
