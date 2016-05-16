import _ from 'lodash';
import { darwinGetAppName } from './installer-info-darwin';
import { defaultGetAppName } from './installer-info-default';
import { retrieveOTP } from './otp-service';
import {
  RUN_LEGACY_VERSION,
  NODE_VERSION,
  NPM_VERSION,
  NSSM_VERSION,
  DEPENDENCY_MANAGER_VERSION,
  CONNECTOR_ASSEMBLER_VERSION,
} from '../config/default-versions';

import {
  DOWNLOAD_MAP
} from '../config/download-map';

import path from 'path';

class InstallerInfo {
  constructor({ emitDebug }) {
    this.emitDebug = emitDebug;
  }

  getAppName(options, callback) {
    if (process.platform === 'darwin') {
      return darwinGetAppName(options, callback);
    }
    return defaultGetAppName(options, callback);
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
      retrieveOTP({ key }, (error, response) => {
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
    if (process.platform === 'win32') {
      return path.join(process.env.LOCALAPPDATA, 'MeshbluConnectors', 'bin');
    }
    return path.join(process.env.HOME, '.octoblu', 'MeshbluConnectors', 'bin');
  }

  getConfig({ key }, response) {
    const { uuid, token, metadata } = response;
    const {
      legacy,
      connector,
      tag,
      dependencyManagerVersion,
      ignitionVersion,
      connectorAssemblerVersion
    } = metadata;

    let githubSlug = metadata.githubSlug;
    let legacyTag = RUN_LEGACY_VERSION
    if(legacy){
      githubSlug = 'octoblu/meshblu-connector-run-legacy'
    }

    const platform = this.getPlatform();
    const binPath = this.getBinPath();

    const deps = _.defaults({
      node: NODE_VERSION,
      npm: NPM_VERSION,
    }, metadata.deps);

    const versions = _.defaults({
      dependencyManagerVersion: DEPENDENCY_MANAGER_VERSION,
      connectorAssemblerVersion: CONNECTOR_ASSEMBLER_VERSION,
    }, {
      dependencyManagerVersion,
      connectorAssemblerVersion,
      ignitionVersion,
    });

    let coreDependencies = _.clone(DOWNLOAD_MAP)
    coreDependencies.assembler.tag = versions.connectorAssemblerVersion
    coreDependencies.assembler.fileName += `-${versions.connectorAssemblerVersion}`
    coreDependencies.dependencyManager.tag = versions.dependencyManagerVersion
    coreDependencies.dependencyManager.fileName += `-${versions.dependencyManagerVersion}`

    return {
      key,
      uuid,
      token,
      connector,
      githubSlug,
      tag,
      legacy,
      legacyTag,
      platform,
      binPath,
      versions,
      deps,
      coreDependencies
    };
  }
}

export default InstallerInfo;
