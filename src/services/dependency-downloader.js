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
      const { connectorInstallerVersion, dependencyManagerVersion } = this.config.versions;
      async.series([
        async.apply(this.download, 'meshblu-connector-installer', connectorInstallerVersion),
        async.apply(this.download, 'meshblu-connector-dependency-manager', dependencyManagerVersion),
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
        stream.pipe(this.getWriteStream(fileName))
      })
      .on('end', () => {
        callback();
      })
  }

  getWriteStream(fileName) {
    const { binPath } = this.config;
    const ext = process.platform === 'win32' ? '.exe' : '';
    this.emitDebug(`Downloading to ${fileName}${ext}`)
    return fs.createWriteStream(path.join(binPath, `${fileName}${ext}`));
  }

  getURL(fileName, tag) {
    const { platform } = this.config;
    return `https://github.com/octoblu/go-${fileName}/releases/download/${tag}/${fileName}-${platform}`
  }
}

export default DependencyDownloader;
