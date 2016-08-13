import request from 'request';
import fs from 'fs-extra';
import async from 'async';
import path from 'path';
import temp from 'temp';

class DependencyDownloader {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug;
    this.config = config;
  }

  downloadAll(callback) {
    this.emitDebug('Downloading dependencies')
    const { installer } = this.config.coreDependencies;
    installer.filePath = this.getFullFilePath(installer);
    async.series([
      async.apply(this.download, installer),
      async.apply(this.makeExecutable, installer),
    ], callback);
  }

  download = ({ projectName, filePath, tag }, callback) => {
    const uri = this.getURL({ projectName, tag });
    this.emitDebug(`Downloading ${uri}...`)
    const writeStream = this.getWriteStream({ filePath })
    writeStream.on('close', callback)

    const stream = request.get(uri)
    .on('error', callback)
    .on('response', (response) => {
      if (response.statusCode >= 400) {
        this.emitDebug(`Invalid statusCode ${response.statusCode} downloading ${uri}`)
        return callback(new Error('Invalid Dependency Download'))
      }
    })
    .pipe(writeStream)
  }

  makeExecutable = ({ filePath }, callback) => {
    const { platform } = process;
    if (platform === 'win32') return callback();
    fs.chmod(filePath, '755', callback);
  }

  getWriteStream({ filePath }) {
    this.emitDebug(`Downloading to ${filePath}`);
    return fs.createWriteStream(filePath);
  }

  getFullFilePath({ fileName }) {
    const { platform } = process;
    const ext = platform === 'win32' ? '.exe' : '';
    return temp.path({suffix: ext})
  }

  getURL({ projectName, tag }) {
    const { platform } = this.config;
    return `https://github.com/octoblu/go-${projectName}/releases/download/${tag}/${projectName}-${platform}`
  }
}

export default DependencyDownloader;
