import _ from 'lodash';
import { darwinGetAppName } from './installer-info-darwin';
import { defaultGetAppName } from './installer-info-default';

export default class GetOTPKey {
  getAppName(options, callback) {
    if (process.platform === 'darwin') {
      return darwinGetAppName(options, callback);
    }
    return defaultGetAppName(options, callback);
  }

  getKey(callback) {
    const launchPath = _.first(process.argv);
    this.getAppName({ launchPath }, (error, appName) => {
      if (error) {
        return callback(error);
      }
      if (!appName) {
        return callback(new Error(`Invalid FileName ${launchPath}`))
      }
      const key = this.getKeyFromAppName(appName);
      callback(null, { key })
    });
  }

  getKeyFromAppName(appName) {
    const part = appName.replace('MeshbluConnectorInstaller-', '');
    const smallerPart = part.replace(/\.\w+$/, '');
    const lastParts = smallerPart.split(/[^\w]+/);
    return _.first(lastParts);
  }
}
