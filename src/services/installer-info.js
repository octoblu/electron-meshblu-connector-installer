import _ from 'lodash';
import { darwinGetAppName } from './installer-info-darwin';
import { windowsGetAppName } from './installer-info-windows';
import { exchange, fakeExchange } from './otp-service';
import {
  RUN_LEGACY_VERSION,
  NODE_VERSION,
  NPM_VERSION,
  NSSM_VERSION,
  DEPENDENCY_MANAGER_VERSION,
  CONNECTOR_ASSEMBER_VERSION,
} from '../config/default-versions'

import path from 'path';

class InstallerInfo {
  constructor({ emitDebug }) {
    this.emitDebug = emitDebug;
  }

  getAppName(options, callback) {
    if (process.platform === 'darwin') {
      return darwinGetAppName(options, callback);
    }
    if (process.platform === 'win32') {
      return windowsGetAppName(options, callback);
    }
    return callback(new Error(`Invalid platform ${process.platform}`));
  }

  exchangeToken = (options, callback) => {
    if (process.env.NODE_ENV === 'production') {
      exchange(options, callback);
      return;
    }
    this.emitDebug('Using fake key!');
    fakeExchange(options, callback);
  }

  getInfo(callback) {
    const launchPath = _.first(process.argv);
    this.getAppName({ launchPath }, (error, appName) => {
      if (error) {
        return callback(error);
      }
      if (!appName) {
        return callback(new Error(`Invalid FileName ${launchPath}`))
      }
      const key = this.getKey(appName);
      this.emitDebug(`Found key ${key}`)
      if (!key) return callback(new Error('Invalid Key for Installation'));
      this.exchangeToken({ key }, (error, response) => {
        if (error) return callback(new Error('Installer already used. Download a new one.'));

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
    const goOS = os === 'win32' ? 'windows' : os;
    const goArch = arc === 'ia32' ? '386' : 'amd64';
    return `${goOS}-${goArch}`;
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
    } else if (process.platform === 'win32') {
      return path.join(process.env.LOCALAPPDATA, 'MeshbluConnectors', 'bin');
    }
    return path.join(process.env.HOME, '.octoblu', 'bin');
  }

  generateDownloadURI({ githubSlug, tag, connector, platform, legacy }) {
    let ext = "tar.gz";
    if(process.platform === "win32") {
      ext = "zip";
    }
    if(legacy) {
      return `https://github.com/octoblu/meshblu-connector-run-legacy/releases/download/${RUN_LEGACY_VERSION}/run-legacy-${platform}.${ext}`
    }
    return `https://github.com/${githubSlug}/releases/download/${tag}/${connector}-${platform}.${ext}`
  }

  getConfig({ key }, response) {
    const { uuid, token, metadata } = response;
    const {
      legacy,
      connector,
      githubSlug,
      tag,
      dependencyManagerVersion,
      connectorAssemblerVersion
    } = metadata;

    const platform = this.getPlatform();
    const binPath = this.getBinPath();

    const deps = _.defaults({
      node: NODE_VERSION,
      npm: NPM_VERSION,
      nssm: NSSM_VERSION,
    }, metadata.deps);

    const versions = _.defaults({
      dependencyManagerVersion: DEPENDENCY_MANAGER_VERSION,
      connectorAssemblerVersion: CONNECTOR_ASSEMBER_VERSION,
    }, {
      dependencyManagerVersion,
      connectorAssemblerVersion,
    });

    const downloadURI = this.generateDownloadURI({ githubSlug, tag, connector, platform, legacy })

    return {
      key,
      uuid,
      token,
      connector,
      legacy,
      downloadURI,
      platform,
      binPath,
      versions,
      deps,
    };
  }
}

export default InstallerInfo;
