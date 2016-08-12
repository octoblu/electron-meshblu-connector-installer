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
      const otpKey = this.getKeyFromAppName(appName);
      callback(null, { otpKey })
    });
  }

  getKeyFromAppName(appName) {
    appName = appName || ''
    let part = appName.replace('MeshbluConnectorInstaller-', '')
    part = part || ''
    const smallerPart = part.replace(/\.\w+$/, '')
    const lastParts = smallerPart.split(/[^\w]+/)
    return _.first(lastParts)
  }
}
