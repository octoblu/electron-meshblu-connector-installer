import { exec } from 'child_process';
import async from 'async';
import path from 'path'

class ExecuteThings {
  constructor(config) {
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
    this.execute({ executable, args, cwd: binPath }, callback);
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
    this.execute({ executable, args, cwd: binPath }, callback);
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
    this.execute({ executable, args, cwd: binPath }, callback);
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
    this.execute({ executable, args, cwd: binPath }, callback);
  }

  execute({ executable, args, cwd }, callback) {
    const command = `.${path.sep}${executable} ${args.join(' ')}`;
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        return callback(error);
      }
      console.log('stdout', stdout);
      console.log('stderr', stderr);
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
