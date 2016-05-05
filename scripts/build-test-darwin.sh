#!/bin/bash

main() {
  local arch="x64"
  local platform="darwin"

  echo "* cleaning up"
  rm -rf "./release/${platform}-${arch}"

  echo "* packaging..."
  env PLATFORM="darwin" ARCH="x64" ./deploy/build

  echo "* generating key"
  local key="$(./scripts/create-test-key)"
  echo "* key: $key"

  mv "./release/MeshbluConnectorInstaller-$platform-$arch.dmg" "./release/MeshbluConnectorInstaller-$key.dmg"
  open "./release/MeshbluConnectorInstaller-$key.dmg"
  echo "* done"
}

main
