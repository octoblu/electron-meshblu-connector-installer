#!/bin/bash

main() {
  echo "* cleaning up"
  rm -rf ./release/*-darwin-amd64

  echo "* packaging..."
  env PLATFORM="darwin" ARCH="x64" ./deploy/build

  echo "* generating key"
  local key="$(./scripts/create-test-key)"
  echo "* key: $key"

  mv "./release/MeshbluConnectorInstaller-darwin-amd64.dmg" "./release/MeshbluConnectorInstaller-$key.dmg"
  open "./release/MeshbluConnectorInstaller-$key.dmg"
  echo "* done"
}

main
