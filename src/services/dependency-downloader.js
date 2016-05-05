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
      const { assembler, dependencyManager } = this.config.coreDependencies;
      async.series([
        async.apply(this.download, assembler),
        async.apply(this.makeExecutable, assembler),
        async.apply(this.download, dependencyManager),
        async.apply(this.makeExecutable, dependencyManager),
      ], callback);
    });
  }

  download = ({ projectName, fileName, tag }, callback) => {
    const filePath = this.getFullFilePath({ fileName, tag });
    fs.exists(filePath, (exists) => {
      if (exists) return callback();
      const uri = this.getURL({ projectName, tag });
      this.emitDebug(`Downloading ${uri}...`)
      const stream = request.get(uri)
        .on('error', callback)
        .on('response', (response) => {
          if(response.statusCode >= 400){
            this.emitDebug(`Invalid statusCode ${response.statusCode} downloading ${uri}`)
            return callback(new Error('Invalid Dependency Download'))
          }
          stream.on('end', callback).pipe(this.getWriteStream({ fileName, tag }))
        });
    });
  }

  makeExecutable = ({ fileName, tag }, callback) => {
    const { platform } = process;
    if (platform === "win32") return callback();
    const filePath = this.getFullFilePath({ fileName, tag });
    fs.chmod(filePath, '755', callback);
  }

  getWriteStream({ fileName, tag }) {
    const filePath = this.getFullFilePath({ fileName, tag });
    this.emitDebug(`Downloading to ${filePath}`);
    return fs.createWriteStream(filePath);
  }

  getFullFilePath({ fileName, tag }) {
    const { binPath } = this.config;
    const ext = process.platform === 'win32' ? '.exe' : '';
    return path.join(binPath, `${fileName}${ext}`);
  }

  getURL({ projectName, tag }) {
    const { platform } = this.config;
    return `https://github.com/octoblu/go-${projectName}/releases/download/${tag}/${projectName}-${platform}`
  }
}

export default DependencyDownloader;
