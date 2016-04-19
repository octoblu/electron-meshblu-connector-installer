import { exec } from 'child_process';
import async from 'async';
import path from 'path'

class ExecuteThings {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug;
    this.config = config;
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
    const executable = `meshblu-connector-dependency-manager${this.getExt()}`;
    const args = [
      '--type',
      'node',
      '--tag',
      `${node}`
    ];
    this.emitDebug(`Installing node ${node}`)
    this.execute({ executable, args, cwd: binPath }, (error) => {
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
    const executable = `meshblu-connector-dependency-manager${this.getExt()}`;
    const args = [
      '--type',
      'npm',
      '--tag',
      `${npm}`
    ];
    this.emitDebug(`Installing npm ${npm}`)
    this.execute({ executable, args, cwd: binPath }, (error) => {
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
    const executable = `meshblu-connector-dependency-manager${this.getExt()}`;
    const args = [
      '--type',
      'nssm',
      '--tag',
      `${nssm}`
    ];
    this.emitDebug(`Installing nssm ${nssm}`)
    this.execute({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("NSSM Install Failure"))
      callback()
    });
  }

  installConnector(callback) {
    const { binPath, uuid, token, connector, versions } = this.config;
    const { tag } = versions
    const executable = `meshblu-connector-installer${this.getExt()}`;
    const args = [
      '--connector',
      `${connector}`,
      '--uuid',
      `${uuid}`,
      '--token',
      `${token}`,
      '--tag',
      `${tag}`,
      this.getLegacyArg()
    ];
    this.emitDebug(`Installing connector ${connector} ${tag}`)
    this.execute({ executable, args, cwd: binPath }, (error) => {
      if(error) return callback(new Error("Connector Install Failure"))
      callback()
    });
  }

  execute({ executable, args, cwd }, callback) {
    const command = `.${path.sep}${executable} ${args.join(' ')}`;
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        this.emitDebug(`Executable Error: ${error.message}`);
        return callback(error);
      }
      this.emitDebug(`stdout ${stdout}`);
      this.emitDebug(`stderr ${stderr}`);
      callback();
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
