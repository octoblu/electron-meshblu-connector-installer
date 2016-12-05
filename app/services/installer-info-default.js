import _ from 'lodash'
import path from 'path'

export function defaultGetAppName({ launchPath }, callback) {
  callback(null, getAppNameFromLaunchPath(launchPath))
}

function getAppNameFromLaunchPath(launchPath) {
  const parts = launchPath.split(path.sep)
  return _.find(parts, (part) => {
    return /^MeshbluConnectorInstaller-\w+$/.test(part)
  })
}
