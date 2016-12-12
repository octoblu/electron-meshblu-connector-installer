/* eslint-disable no-console */
import _ from 'lodash'
import { darwinGetAppName } from './installer-info-darwin'
import { defaultGetAppName } from './installer-info-default'

export default class GetOTPKey {
  getAppName(options, callback) {
    if (process.platform === 'darwin') {
      return darwinGetAppName(options, callback)
    }
    return defaultGetAppName(options, callback)
  }

  getKey(callback) {
    const launchPath = process.execPath
    console.log('launchPath', { launchPath })
    this.getAppName({ launchPath }, (error, appName) => {
      this.running = false
      if (error) {
        console.error('getKey error', error)
        return callback(error)
      }
      const otpKey = this.getKeyFromAppName(appName)
      console.log('get otp key from app name', { appName, otpKey })
      callback(null, { otpKey })
    })
  }

  getKeyFromAppName(appName = '') {
    const part = appName.replace('MeshbluConnectorInstaller-', '')
    const smallerPart = part.replace(/\.\w+$/, '')
    const lastParts = smallerPart.split(/[^\w]+/)
    return _.first(lastParts)
  }
}
