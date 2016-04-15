import _                    from 'lodash'
import { darwinGetAppName } from './installer-info-darwin'
import { exchange, fakeExchange } from './otp-service'
import path from 'path'

class InstallerInfo {
  getAppName(options, callback) {
    if(process.platform === "darwin"){
      return darwinGetAppName(options, callback)
    }
    return callback(new Error('Invalid platform'))
  }

  getInfo(callback) {
    const launchPath = _.first(process.argv)
    this.getAppName({launchPath}, (error, appName) => {
      if(error) {
        return callback(error)
      }
      const key = this.getKey(appName)
      if(!key) return callback(new Error('Invalid Key for Installation'))
      fakeExchange({key}, (error, response) => {
        if(error) return callback(error)
        const {uuid, token, metadata} = response
        const {legacy, connector, dependency_manager, connector_installer, node} = metadata
        const platform = this.getPlatform()
        const binPath = this.getBinPath()
        callback(null, {
          key,
          uuid,
          token,
          connector,
          dependency_manager,
          connector_installer,
          node,
          platform,
          binPath
        })
      })
    })
  }

  getKey(appName) {
    let part = appName.replace('MeshbluConnectorInstaller-', '')
    let smallerPart = part.replace(/\.\w+$/, '')
    let lastParts = smallerPart.split(/[^\w]+/)
    return _.first(lastParts)
  }

  getPlatform() {
    const os = process.platform
    const arc = process.arch
    let go_arch = arc === "x86" ? "386" : "amd64"
    return `${os}-${go_arch}`
  }

  getBinPath() {
    if(process.platform === "darwin") {
      return path.join(process.env.HOME, "Library", "Application Support", "MeshbluConnectors", "bin")
    }else if(process.platform === "windows") {
      return path.join(process.env.LOCALAPPDATA, "MeshbluConnectors", "bin")
    }
    return path.join(process.env.HOME, ".octoblu", "bin")
  }

}

export default InstallerInfo
