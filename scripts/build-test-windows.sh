#!/bin/bash

main() {
  local arch="ia32"
  local platform="win32"
  echo "* cleaning up"
  rm -rf "./release/${platform}-${arch}"

  echo "* packaging..."
  npm run package -- --platform "$platform" --arch "$arch"

  echo "* generating key"
  local key="$(./scripts/create-key "say-hello")"
  echo "* key: $key"

  pushd "./release/MeshbluConnectorInstaller-${platform}-${arch}"
    zip -r -X MeshbluConnectorInstaller.zip *
    cp MeshbluConnectorInstaller.zip ~/Documents/SharedWithWindows/MeshbluConnectorInstaller-$key.zip
  popd
  echo "* done";
}

main
