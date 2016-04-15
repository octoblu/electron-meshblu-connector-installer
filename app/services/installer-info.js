import _ from 'lodash';
import { darwinGetAppName } from './installer-info-darwin';
import { exchange, fakeExchange } from './otp-service';
import path from 'path';

class InstallerInfo {
  getAppName(options, callback) {
    if (process.platform === 'darwin') {
      return darwinGetAppName(options, callback);
    }
    return callback(new Error('Invalid platform'));
  }

  getInfo(callback) {
    const launchPath = _.first(process.argv);
    this.getAppName({ launchPath }, (error, appName) => {
      if (error) {
        return callback(error);
      }
      const key = this.getKey(appName);
      if (!key) return callback(new Error('Invalid Key for Installation'));
      fakeExchange({ key }, (error, response) => {
        if (error) return callback(error);

        callback(null, this.getConfig({ key }, response));
      });
    });
  }

  getKey(appName) {
    const part = appName.replace('MeshbluConnectorInstaller-', '');
    const smallerPart = part.replace(/\.\w+$/, '');
    const lastParts = smallerPart.split(/[^\w]+/);
    return _.first(lastParts);
  }

  getPlatform() {
    const os = process.platform;
    const arc = process.arch;
    const goArch = arc === 'x86' ? '386' : 'amd64';
    return `${os}-${goArch}`;
  }

  getBinPath() {
    if (process.platform === 'darwin') {
      return path.join(
        process.env.HOME,
        'Library',
        'Application Support',
        'MeshbluConnectors',
        'bin'
      );
    } else if (process.platform === 'windows') {
      return path.join(process.env.LOCALAPPDATA, 'MeshbluConnectors', 'bin');
    }
    return path.join(process.env.HOME, '.octoblu', 'bin');
  }

  getConfig({ key }, response) {
    const { uuid, token, metadata } = response;
    const {
      legacy,
      connector,
      dependency_manager,
      connector_installer,
      node,
      npm,
      nssm
    } = metadata;
    const platform = this.getPlatform();
    const binPath = this.getBinPath();

    return {
      key,
      uuid,
      token,
      connector,
      legacy,
      platform,
      binPath,
      versions: {
        dependency_manager,
        connector_installer,
        node,
        npm,
        nssm
      }
    };
  }
}

export default InstallerInfo;
