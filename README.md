# electron-meshblu-connector-installer

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][david_img]][david_site]

## Install

First, clone the repo via git:

```bash
git clone https://github.com/octoblu/electron-meshblu-connector-installer.git
```

And then install dependencies.

```bash
$ cd meshblu-connector-installer && npm install
```


## Run

Run this two commands __simultaneously__ in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

*Note: requires a node version >= 4 and an npm version >= 2.*

## DevTools

#### Toggle Chrome DevTools

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

## Package

```bash
$ npm run package
```

To package apps for all platforms:

```bash
$ npm run package-all
```

#### Options

- --name, -n: Application name (default: ElectronReact)
- --version, -v: Electron version (default: latest version)
- --asar, -a: [asar](https://github.com/atom/asar) support (default: false)
- --icon, -i: Application icon
- --platform: pack for platform
- --arch: pack for arch
- --all: pack for all platforms

Use `electron-packager` to pack your app with `--all` options for darwin (osx), linux and win32 (windows) platform. After build, you will find them in `release` folder. Otherwise, you will only find one for your os.

`test`, `tools`, `release` folder and devDependencies in `package.json` will be ignored by default.

#### Building windows apps from non-windows platforms

Please checkout [Building windows apps from non-windows platforms](https://github.com/maxogden/electron-packager#building-windows-apps-from-non-windows-platforms).

[npm-image]: https://img.shields.io/npm/v/electron-meshblu-connector-installer.svg?style=flat-square
[npm-url]: https://npmjs.org/package/electron-meshblu-connector-installer
[travis-image]: https://travis-ci.org/octoblu/electron-meshblu-connector-installer.svg?branch=master
[travis-url]: https://travis-ci.org/octoblu/electron-meshblu-connector-installer
[david_img]: https://img.shields.io/david/octoblu/electron-meshblu-connector-installer.svg
[david_site]: https://david-dm.org/octoblu/electron-meshblu-connector-installer
