#!/bin/bash

main() {
  local arch="ia32"
  local platform="win32"
  local destination="$HOME/Documents/SharedWithWindows"

  echo "* cleaning up"
  rm -rf $destination/MeshbluConnectorInstaller-*
  rm -rf "./release/${platform}-${arch}"

  echo "* packaging..."
  npm run package -- --platform "$platform" --arch "$arch"

  echo "* generating key"
  local key="$(./scripts/create-test-key)"
  echo "* key: $key"

  pushd "./release/MeshbluConnectorInstaller-${platform}-${arch}"
    zip -r -X MeshbluConnectorInstaller.zip *
    cp MeshbluConnectorInstaller.zip "$destination/MeshbluConnectorInstaller-$key.zip"
  popd
  echo "* done";
}

main
