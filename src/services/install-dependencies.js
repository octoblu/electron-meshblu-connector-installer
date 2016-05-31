import _ from 'lodash';
import async from 'async';
import Execute from './execute';

class InstallDepedencies {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug;
    this.config = config;
    this.execute = new Execute({ emitDebug })
  }

  install(callback) {
    const { deps } = this.config;
    const tasks = _.map(deps, (tag, type) => {
      return async.apply(this.installSingleDep, { type, tag });
    });
    async.series(tasks, callback);
  }

  installSingleDep = ({ type, tag }, callback) => {
    if (!this.shouldInstallDep(type)) {
      return callback();
    }
    const { binPath } = this.config;
    const { dependencyManager } = this.config.coreDependencies;
    const executable = this.execute.getFile(dependencyManager.fileName);
    const args = [
      '--type',
      type,
      '--tag',
      tag,
    ];
    this.emitDebug(`Installing ${type} ${tag}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if (error) return callback(new Error(`${type} ${tag} install failure`))
      callback()
    });
  }

  shouldInstallDep(type) {
    const { platform } = process;
    if (type === 'nssm') {
      return false;
    }
    if (type === 'npm' && platform !== 'win32') {
      return false;
    }
    return true;
  }
}

export default InstallDepedencies;
