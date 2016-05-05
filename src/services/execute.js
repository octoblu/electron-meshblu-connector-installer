import spawn from 'cross-spawn-async';
import path from 'path';
import sudo from 'electron-sudo';

export default class Execute {
  constructor({ emitDebug }) {
    this.emitDebug = emitDebug;
  }

  do({ executable, args, cwd }, callback) {
    const child = spawn(executable, args, {cwd});

    child.stdout.on('data', (data) => {
      this.emitDebug(`stdout: ${data.toString()}`);
    });

    child.stderr.on('data', (data) => {
      this.emitDebug(`stderr: ${data.toString()}`);
    });

    child.on('close', (code) => {
      this.emitDebug(`${executable} exited ${code}`);
      if(code > 0){
        return callback(new Error('Error during installation'))
      }
      callback();
    });

    child.on('error', (error) => {
      this.emitDebug(`${executable} exited with error ${error.message}`);
      callback(error);
    });
  }

  doSudo({ executable, args, cwd }, callback) {
    const options = {
      name: 'Meshblu Connector Installer',
      process: {
        options: {
          cwd,
        },
        on: (child) => {
          child.stdout.on('data', (data) => {
            this.emitDebug(`stdout: ${data.toString()}`);
          });

          child.stderr.on('data', (data) => {
            this.emitDebug(`stderr: ${data.toString()}`);
          });
        }
      }
    }
    const command = `${executable} ${args.join(' ')}`
    sudo.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        this.emitDebug(`${executable} exit with error ${error}`);
        return callback(new Error('Error during installation'))
      }
      return callback()
    })
  }

  getFile(filename) {
    let ext = '';
    if (process.platform === 'win32') {
      ext = '.exe';
    }
    return `.${path.sep}${filename}${ext}`;
  }
}
