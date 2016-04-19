import request from 'request';
import fs from 'fs-extra';
import async from 'async';
import path from 'path';

class DependencyDownloader {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug;
    this.config = config;
  }

  downloadAll(callback) {
    const { binPath } = this.config;
    this.emitDebug(`Making the bin path: ${binPath}`)
    fs.mkdirs(binPath, (error) => {
      if (error) return callback(error);
      async.parallel([
        this.downloadCI,
        this.downloadDepMan
      ], callback);
    });
  }

  downloadCI = (callback) => {
    const { connector_installer } = this.config.versions;
    const fileName = 'meshblu-connector-installer';
    const uri = this.getURL(fileName, connector_installer);
    this.emitDebug(`Downloading ${uri}...`)
    request.get(uri)
      .on('error', callback)
      .on('end', () => {
        callback();
      })
      .pipe(this.getWriteStream(fileName));
  }

  downloadDepMan = (callback) => {
    const { dependency_manager } = this.config.versions;
    const fileName = 'meshblu-connector-dependency-manager';
    const uri = this.getURL(fileName, dependency_manager);
    this.emitDebug(`Downloading ${uri}...`)
    request.get(uri)
      .on('error', callback)
      .on('end', () => {
        callback();
      })
      .pipe(this.getWriteStream(fileName));
  }

  getWriteStream(fileName) {
    const { binPath } = this.config;
    const ext = process.platform === 'win32' ? '.exe' : '';
    this.emitDebug(`Downloading to ${fileName}${ext}`)
    return fs.createWriteStream(path.join(binPath, `${fileName}${ext}`));
  }

  getURL(fileName, tag) {
    const { platform } = this.config;
    return `https://meshblu-connector.octoblu.com/tools/go-${fileName}/${tag}/${fileName}-${platform}`;
  }
}

export default DependencyDownloader;
