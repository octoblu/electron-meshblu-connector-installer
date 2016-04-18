#!/bin/bash

main() {
  local arch="ia32"
  local platform="win32"
  rm -rf "./release/${platform}-${arch}"
  npm run package -- --platform "$platform" --arch "$arch"
  pushd "./release/MeshbluConnectorInstaller-${platform}-${arch}"
    zip -r -X MeshbluConnectorInstaller.zip *
    cp MeshbluConnectorInstaller.zip ~/Documents/SharedWithWindows/MeshbluConnectorInstaller-1234.zip
  popd
  echo "done";
}

main
