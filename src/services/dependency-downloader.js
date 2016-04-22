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
      this.emitDebug(`Downloading dependencies`)
      const { connectorAssemblerVersion, dependencyManagerVersion } = this.config.versions;
      async.series([
        async.apply(this.download, 'meshblu-connector-assembler', connectorAssemblerVersion),
        async.apply(this.makeExecutable, 'meshblu-connector-assembler'),
        async.apply(this.download, 'meshblu-connector-dependency-manager', dependencyManagerVersion),
        async.apply(this.makeExecutable, 'meshblu-connector-assembler'),
      ], callback);
    });
  }

  download = (fileName, tag, callback) => {
    const uri = this.getURL(fileName, tag);
    this.emitDebug(`Downloading ${uri}...`)
    const stream = request.get(uri)
      .on('error', callback)
      .on('response', (response) => {
        if(response.statusCode >= 400){
          this.emitDebug(`Invalid statusCode ${response.statusCode} downloading ${uri}`)
          return callback(new Error('Invalid Dependency Download'))
        }
        stream.on('end', callback).pipe(this.getWriteStream(fileName))
      });
  }

  makeExecutable = (fileName, callback) => {
    const { platform } = process;
    if (platform === "win32") return callback();
    const filePath = this.getFullFilePath(fileName);
    fs.chmod(filePath, '755', callback);
  }

  getWriteStream(fileName) {
    const filePath = this.getFullFilePath(fileName);
    this.emitDebug(`Downloading to ${filePath}`);
    return fs.createWriteStream(filePath);
  }

  getFullFilePath(fileName) {
    const { binPath } = this.config;
    const ext = process.platform === 'win32' ? '.exe' : '';
    return path.join(binPath, `${fileName}${ext}`);
  }

  getURL(fileName, tag) {
    const { platform } = this.config;
    return `https://github.com/octoblu/go-${fileName}/releases/download/${tag}/${fileName}-${platform}`
  }
}

export default DependencyDownloader;
