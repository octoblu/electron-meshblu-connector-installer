import spawn from 'cross-spawn';
import async from 'async';
import path from 'path';
import _ from 'lodash';

export default class Execute {
  constructor({ emitDebug }) {
    this.emitDebug = emitDebug;
    this.do = this.do.bind(this);
    this.doAndRetry = this.doAndRetry.bind(this);
  }

  do({ executable, args, cwd }, callback) {
    const env = _.assign(process.env, {
      DEBUG: 'meshblu-connector-*',
    })
    const child = spawn(executable, args, { cwd, env });

    child.on('error', (error) => {
      this.emitDebug(`${executable} exited with error ${error.message}`);
      callback(error);
    });

    child.stdout.on('data', (data) => {
      this.logOutput('stdout', data)
    });

    child.stderr.on('data', (data) => {
      this.logOutput('stderr', data)
    });

    child.on('close', (code) => {
      this.emitDebug(`${executable} exited ${code}`);
      if (code > 0) {
        return callback(new Error('Error during installation'))
      }
      callback();
    });

  }

  doAndRetry({ executable, args, cwd }, callback) {
    const options = { times: 3, interval: 100 }
    async.retry(options, async.apply(this.do, { executable, args, cwd }), callback)
  }

  logOutput(key, ouput) {
    const str = ouput.toString()
    const lines = str.split('\n')
    _.each(lines, (line) => {
      if (line.indexOf(' - ') > -1) {
        const debugLine = _.last(line.split(' - '))
        if (!_.isEmpty(line)) {
          this.emitDebug(`debug: ${debugLine}`);
        }
        return
      }
      if (!_.isEmpty(line)) {
        this.emitDebug(`${key}: ${line}`);
      }
    })
  }
}
