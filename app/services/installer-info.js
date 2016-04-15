import _                    from 'lodash'
import { darwinGetAppName } from './installer-info-darwin'

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
      let config = this.parseConfig({appName})
      callback(null, config)
    })
  }

  getKey(appName) {
    let part = appName.replace('MeshbluConnectorInstaller-', '')
    let smallerPart = part.replace(/\.\w+$/, '')
    let lastParts = smallerPart.split(/[^\w]+/)
    return _.first(lastParts)
  }

  parseConfig({appName}) {
    let key = this.getKey(appName)
    return {appName, key}
  }
}

export default InstallerInfo
