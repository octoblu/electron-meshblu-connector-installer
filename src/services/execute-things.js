import async from 'async';
import path from 'path';
import Execute from './execute';

import {
  DOWNLOAD_MAP
} from '../config/download-map'

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
    const executable = this.getExecutable(DOWNLOAD_MAP.dependencyManager.fileName);
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
    const {
      binPath,
      uuid,
      token,
      connector,
      downloadURI,
      versions,
    } = this.config;
    const { ignitionVersion } = versions;

    const executable = this.getExecutable(DOWNLOAD_MAP.assembler.fileName);
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
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("Connector Install Failure"))
      callback()
    });
  }

  shouldInstallDep(type) {
    const { platform } = process;
    if(type === "nssm") {
      return false;
    }
    if(type === "npm" && platform !== "win32") {
      return false;
    }
    return true;
  }

  getExecutable(filename) {
    let ext = '';
    if (process.platform === 'win32') {
      ext = '.exe';
    }
    return `.${path.sep}${filename}${ext}`;
  }
}

export default ExecuteThings;
