import {exec} from 'child_process'
import _      from 'lodash'

export function darwinGetAppName({launchPath}, callback){
  const options = {
    cwd: getVolumePath({launchPath})
  }
  const child = exec("hdiutil info", options, (error, stdout, stderr) => {
    if(error) {
      return callback(error)
    }
    let imagePath = getImagePath(stdout)
    let appName = getAppNameFromImagePath(imagePath)
    callback(null, appName)
  })
}

function getVolumePath({launchPath}){
  let parts = launchPath.split('/')
  if(parts[1] === "Volumes") {
    return `/${parts[1]}/${parts[2]}`
  }
  return "/Volumes/MeshbluConnectorInstaller"
}

function getImagePath(stdout){
  const lines = stdout.split(/\r?\n/)
  var imagePath
  _.some(lines, (line) => {
    let parts = line.split(':')
    let key = _.trim(parts[0])
    let value = _.trim(parts[1])
    if(key === "image-path" && value.indexOf('MeshbluConnectorInstaller-') > -1) {
      imagePath = value
      return true
    }
  })
  return imagePath
}

function getAppNameFromImagePath(imagePath) {
  let parts = imagePath.split("/")
  return _.find(parts, (part) => {
    return /^MeshbluConnectorInstaller\-.+\.dmg$/.test(part)
  })
}
