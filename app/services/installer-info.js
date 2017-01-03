import _ from 'lodash'
import { retrieveOTP } from './otp-service'
import {
  NODE_VERSION,
  NPM_VERSION,
} from '../config/default-versions'

import {
  DOWNLOAD_MAP,
} from '../config/download-map'

class InstallerInfo {
  constructor({ emitDebug }) {
    this.emitDebug = emitDebug
  }

  getInfo({ otpKey, serviceType }, callback) {
    retrieveOTP({ otpKey }, (error, response) => {
      if (error) {
        return callback(new Error('Installer already used. Download a new one.'))
      }
      callback(null, this.getConfig({ otpKey, serviceType }, response))
    })
  }

  getPlatform() {
    const os = process.platform
    const arc = process.arch
    const goOS = os === 'win32' ? 'windows' : os
    if (arc === 'arm') {
      return `${goOS}-arm`
    } else if (arc === 'ia32') {
      return `${goOS}-386`
    }
    return `${goOS}-amd64`
  }

  getConfig({ otpKey, serviceType }, response) {
    const { uuid, token, metadata } = _.cloneDeep(response)
    const {
      connector,
      tag,
      installerVersion,
      octoblu,
    } = metadata

    const githubSlug = metadata.githubSlug

    const platform = this.getPlatform()

    const deps = _.defaults({
      node: NODE_VERSION,
      npm: NPM_VERSION,
    }, metadata.deps)

    const versions = {
      installerVersion,
    }

    const coreDependencies = _.cloneDeep(DOWNLOAD_MAP)
    coreDependencies.installer.tag = versions.installerVersion
    coreDependencies.installer.fileName += `-${versions.installerVersion}`

    return {
      otpKey,
      serviceType,
      uuid,
      token,
      octoblu,
      connector,
      githubSlug,
      tag,
      platform,
      versions,
      deps,
      coreDependencies,
    }
  }
}

export default InstallerInfo
