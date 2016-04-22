import {spawn} from 'child_process';

export default class Execute {
  constructor({ emitDebug }) {
    this.emitDebug = emitDebug;
  }

  do({ executable, args, cwd }, callback) {
    const child = spawn(executable, args, {cwd});

    child.stdout.on('data', (data) => {
      this.emitDebug(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      this.emitDebug(`stderr: ${data}`);
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
}
