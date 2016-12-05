import { exec } from 'child_process'
import fs from 'fs'
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
  const parts = launchPath.split('/')
  if (parts[1] === 'Volumes') {
    return `/${parts[1]}/${parts[2]}`
  }
  return '/Volumes/MeshbluConnectorInstaller'
}

function getEscapedVolumePath({ launchPath }) {
  const parts = launchPath.split('/')
  if (parts[1] === 'Volumes') {
    return `\\/${parts[1]}\\/${parts[2]}`
  }
  return '\\/Volumes\\/MeshbluConnectorInstaller'
}


function getImagePath(stdout, launchPath) {
  const sections = stdout.split(/={10,}/)
  let imagePath
  _.some(sections, (section) => {
    const escapedVolumePath = getEscapedVolumePath({ launchPath })
    if (new RegExp(`\\s+${escapedVolumePath}\\s*$`).test(section)) {
      imagePath = parseLines(section)
    }
  })
  return imagePath
}

function parseLines(section) {
  const lines = section.split(/\r?\n/)
  let imagePath
  _.some(lines, (line) => {
    const parts = line.split(':')
    const key = _.trim(parts[0])
    const value = _.trim(parts[1])
    if (key === 'image-path' && value.indexOf('MeshbluConnectorInstaller-') > -1) {
      imagePath = value
    }
  })
  return imagePath
}

function getAppNameFromImagePath(imagePath) {
  const parts = imagePath.split('/')
  return _.find(parts, (part) => {
    return /^MeshbluConnectorInstaller-.+\.dmg$/.test(part)
  })
}
