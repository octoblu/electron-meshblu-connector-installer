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
    async.parallel([
      this.installNode,
      this.installNpm,
      this.installNssm
    ], callback);
  }

  installNode = (callback) => {
    const { binPath, versions } = this.config;
    const { node } = versions;
    const executable = `./meshblu-connector-dependency-manager${this.getExt()}`;
    const args = [
      '--type',
      'node',
      '--tag',
      node
    ];
    this.emitDebug(`Installing node ${node}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("Node Install Failure"))
      callback()
    });
  }

  installNpm = (callback) => {
    if (process.os !== 'win32') {
      return callback();
    }
    const { binPath, versions } = this.config;
    const { npm } = versions;
    const executable = `./meshblu-connector-dependency-manager${this.getExt()}`;
    const args = [
      '--type',
      'npm',
      '--tag',
      npm
    ];
    this.emitDebug(`Installing npm ${npm}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("NPM Install Failure"))
      callback()
    });
  }

  installNssm = (callback) => {
    if (process.os !== 'win32') {
      return callback();
    }
    const { binPath, versions } = this.config;
    const { nssm } = versions;
    const executable = `./meshblu-connector-dependency-manager${this.getExt()}`;
    const args = [
      '--type',
      'nssm',
      '--tag',
      nssm
    ];
    this.emitDebug(`Installing nssm ${nssm}`)
    this.execute.do({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("NSSM Install Failure"))
      callback()
    });
  }

  installConnector(callback) {
    const { binPath, uuid, token, connector, versions } = this.config;
    const { tag } = versions
    const executable = `./meshblu-connector-installer${this.getExt()}`;
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

  getExt() {
    if (process.platform === 'win32') {
      return '.exe';
    }
    return '';
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
