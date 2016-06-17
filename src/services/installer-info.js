import _ from 'lodash';
import { retrieveOTP } from './otp-service';
import {
  RUN_LEGACY_VERSION,
  NODE_VERSION,
  NPM_VERSION,
} from '../config/default-versions';

import {
  DOWNLOAD_MAP,
} from '../config/download-map';

import path from 'path';

class InstallerInfo {
  constructor({ emitDebug }) {
    this.emitDebug = emitDebug;
  }

  getInfo({ key }, callback) {
    retrieveOTP({ key }, (error, response) => {
      if (error) return callback(new Error('Installer already used. Download a new one.'));

      callback(null, this.getConfig({ key }, response));
    });
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
      connectorAssemblerVersion,
      octoblu,
    } = metadata;

    let githubSlug = metadata.githubSlug;
    const legacyTag = RUN_LEGACY_VERSION;
    if (legacy) {
      githubSlug = 'octoblu/meshblu-connector-run-legacy'
    }

    const platform = this.getPlatform();
    const binPath = this.getBinPath();

    const deps = _.defaults({
      node: NODE_VERSION,
      npm: NPM_VERSION,
    }, metadata.deps);

    const versions = {
      dependencyManagerVersion,
      connectorAssemblerVersion,
      ignitionVersion,
    };

    const coreDependencies = _.clone(DOWNLOAD_MAP)
    coreDependencies.assembler.tag = versions.connectorAssemblerVersion
    coreDependencies.assembler.fileName += `-${versions.connectorAssemblerVersion}`
    coreDependencies.dependencyManager.tag = versions.dependencyManagerVersion
    coreDependencies.dependencyManager.fileName += `-${versions.dependencyManagerVersion}`

    return {
      key,
      uuid,
      token,
      octoblu,
      connector,
      githubSlug,
      tag,
      legacy,
      legacyTag,
      platform,
      binPath,
      versions,
      deps,
      coreDependencies,
    };
  }
}

export default InstallerInfo;
