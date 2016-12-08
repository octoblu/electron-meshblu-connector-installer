import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'

export function darwinGetAppName({ launchPath }, callback) {
  const volumePath = getVolumePath({ launchPath })
  fs.exists(volumePath, (exists) => {
    if (!exists) {
      if (process.env.NODE_ENV === 'development') {
        return callback(null, 'thisissampleotp') // sample-otp
      }
      return callback(new Error('Volume Doesn\'t Exist'))
    }
    exec('hdiutil info', { cwd: volumePath }, (error, stdout) => {
      if (error) {
        return callback(error)
      }
      const imagePath = getImagePath(stdout, launchPath)
      if (!imagePath) return callback(new Error('Unable to get imagePath'))
      const appName = getAppNameFromImagePath(imagePath)
      if (!appName) return callback(new Error('Unable to get appName'))
      callback(null, appName)
    })
  })
}

function getVolumePath({ launchPath }) {
  const dir = path.parse(launchPath).dir
  const parts = dir.split(path.sep)
  if (_.nth(parts, 1) === 'Volumes') {
    return path.join('/Volumes', _.nth(parts, 2))
  }
  return path.join('/Volumes', 'MeshbluConnectorInstaller')
}

function getImagePath(stdout, launchPath) {
  const sections = stdout.split(/={10,}/)
  const escapedVolumePath = _.escapeRegExp(getVolumePath({ launchPath }))
  let imagePath
  _.some(sections, (section) => {
    if (imagePath) return
    if (new RegExp(`\\s+${escapedVolumePath}`).test(section)) {
      imagePath = parseLines(section)
    }
  })
  return imagePath
}

function parseLines(section) {
  const lines = section.split(/\r?\n/)
  let imagePath
  _.some(lines, (line) => {
    if (imagePath) return
    const parts = line.split(':')
    const key = _.trim(parts[0])
    const value = _.trim(parts[1])
    if (key === 'image-path' && _.includes(value, 'MeshbluConnectorInstaller-')) {
      imagePath = value
      return true
    }
  })
  return imagePath
}

function getAppNameFromImagePath(imagePath) {
  const parts = imagePath.split('/')
  return _.find(parts, (part) => {
    return /^MeshbluConnectorInstaller-\w+\.dmg$/.test(part)
  })
}
