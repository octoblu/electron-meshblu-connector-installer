import path from 'path'

export function windowsGetAppName({ launchPath }, callback) {
  callback(null, getAppNameFromLaunchPath(launchPath));
}

function getAppNameFromLaunchPath(launchPath) {
  const parts = launchPath.split(path.sep);
  return _.find(parts, (part) => {
    return /^MeshbluConnectorInstaller\-\w+$/.test(part);
  });
}
